'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const discount = require("../models/discount.model")
const { findAllDiscountCodeUnSelect, checkDiscountExist } = require("../models/repository/discount.repo")
const { findAllProducts } = require("../models/repository/product.repo.")
const { convertToObjectIdMongodb } = require("../utils")


/**
 * @Discount_Services
 * 1 - Generate discount code (Code| Admin)
 * 2 - Get all discount codes (User | Shop)
 * 3 - Get all product by discount code (User)
 * 4 - Get discount amount (User)
 * 5 - Delete discount code (Admin | Shop)
 * 6 - Cancel discount Code (User)
 */

class DiscountServices {

    /**
     *  @Create_discount
     */
    static async createDiscountCode(payload) {

        const { code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user }
            = payload
        //kiem tra
        if (new Date() > new Date(start_date) || (new Date() > new Date(end_date))) {
            throw new BadRequestError("Discount code has expried !")
        }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end_date")
        }
        //Create index for discount code
        const foundDiscount = await checkDiscountExist({

            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount exists!")
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_max_uses_per_users: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_max_value: max_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids
        })

        return newDiscount
    }


    /**
    * @update_discount
    */
    static async updateDiscount() {
    }


    /**
     * @Get_all_products_with_discount_codes
     */
    static async getAllProductsWithDiscountCode({ code, shopId, limit = 50, page = 1 }) {
        //Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount not exists!")
        }
        let products = {}
        const { discount_applies_to, discount_product_ids } = foundDiscount
        if (discount_applies_to === 'all') {
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit,
                page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            // get the products ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit,
                page,
                sort: 'ctime',
                select: ['product_name']
            })

        }

        return products
    }

    /**
      * @Get_all_discountCode_with_Product
      */
    static async getAllDiscountCodeWithProduct({ code, shopId, limit = 50, page = 1 }) {
        //Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount not exists!")
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount
        if (discount_applies_to === 'all') {
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit,
                page,
                sort: 'ctime',
                select: ['product_name']
            })

        }
        if (discount_applies_to === 'specific') {
            // get the products ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit,
                page,
                sort: 'ctime',
                select: ['product_name']
            })

        }

        return products
    }



    /**
     * @Get_all_discount_code_of_Shop
     */
    static async getAllDiscountCodeByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodeUnSelect({
            filter: {
                product_shop: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            limit,
            page,
            unSelect: ['__v', 'discount_shopId']
        })
        return discounts
    }

    /**
     * Apply discount code
     * products =[
     * {
     * productId,
     * name
     * },
     * {
     * productId,
     * name
     * },
     * .....
     * ]
     */

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        if (!foundDiscount) throw new NotFoundError("Discount not Exist !!")

        const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date, discount_min_order_value, discount_users_used, discount_max_uses_per_users, discount_type, discount_value } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('discount expried!')

        if (!discount_max_uses) throw new NotFoundError('discount are out!')

        if (new Date() > new Date(discount_start_date) || new Date() > new Date(discount_end_date) || new Date(discount_start_date) >= new Date(discount_end_date)) throw NotFoundError(`discount ecode has expried`)

        // Check xem co set gia tri toi thieu hay khong
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get totalOrder
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) throw new NotFoundError('discount require a minium order value of ', discount_min_order_value)
        }


        if (discount_max_uses_per_users > 0) {
            const userUseDiscount = discount_users_used?.filter(user => user.userId === userId).length
            if (userUseDiscount >= discount_max_uses_per_users) throw new NotFoundError('Discount is used!')
        }

        // Check xem discount_type 
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, code }) {
        const deleted = await discountModel.findOneAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        return deleted
    }

    /**
     * User cancel
     */
    static async cancelDiscountCode({
        code, shopId, userId
    }) {
        const foundDiscount = await checkDiscountExist({
            filter: {
                discount_code: code,
                discount_shop: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError("Discount is not exist!")

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: +1,
                discount_uses_count: -1
            }
        })
        return result
    }

}


module.exports = DiscountServices
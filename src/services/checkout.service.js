'use strict'

const { BadRequestError } = require("../core/error.response")
const orderModel = require("../models/order.model")
const { findCartById } = require("../models/repository/cart.repo")
const { checkProductByServer } = require("../models/repository/product.repo.")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")

class CheckoutService {
    // login and without login

    /**
     * payload:
     * {
            * cartId,
            * userId,
                    * shop_order_ids:[
                    * shopId,
                    * shop_discount: [
                    * shopId,
                    * discountId,
                    * codeId
                    * ],
                    * item_products: [
                                * {
                                * price,
                                * quantity,
                                * productId
                                * }
                             * ]
                            * ]
     * } 
     */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {

        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError("Cart does not exist")

        const checkout_order = {
            totalPrice: 0, //tong tien hang
            feeShip: 0,//phi van chuyen
            totalDiscount: 0, //tong tien giam gia
            totalCheckout: 0 // tong thanh toan
        }
        const shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {

            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            // check product availble
            const checkProductServer = await checkProductByServer(item_products)
            console.log("checkout product sevice: ", checkProductServer);
            if (!checkProductServer[0]) throw new BadRequestError("Order wrong!!!")

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }


            // neu shop_discounts ton tai > 0, check xem co hop le hay khong

            if (shop_discounts.length > 0) {
                // gia su chi co 1 
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                // tong cong amout giam gia
                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(item_products)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order

        }
    }

    /**
     * 
     * Order [User] 
     * @returns 
     */
    static async ordreByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check lai 1 lan nua xem thu co vuot ton kho hay khog
        // get new array products

        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log("[1]:::", products);

        const acquireProduct = [];

        for (let i = 0; i < array.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireLock.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check if co mot san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so sanp pham da duoc cap nhat hoac het hang, vui long quay lai gio hang...')
        }

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // if insert true remove products in cart 
        if (newOrder) {

        }

        return newOrder
    }

    /**
     * Query orders  [User]
     */
    static async getOrdersByUser() {

    }

    /**
    * Query an order  [User]
     */
    static async getOneOrderByUser() {

    }

    /** 
     * cancel order [User]
     * 
    */
    static async cancelOrderByUser() {

    }

    /**
     * Update Order status by [Shop | Admin]
     */
    static async updateOrderStatusByShop() {

    }

}

module.exports = CheckoutService
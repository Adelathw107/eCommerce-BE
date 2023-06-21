'use strict'

const { NotFoundError } = require("../core/error.response")
const cartModel = require("../models/cart.model")
const { createUserCart, updateUserCartQuantity, deleteUserCart } = require("../models/repository/cart.repo")
const { findProduct } = require("../models/repository/product.repo.")

/**
 * KEy Feature: Cart Service
 * - add product to cart [user]
 * - reduce product quantity by one [User]
 * - increase product quntity by One [User]
 * - get cart [User]
 * - Delete cart [User]
 * -Delete cart item [User]
 */


class CartService {

    static async addToCart({ userId, product = {} }) {
        // check cart ton tai hay khong?
        const userCart = await cartModel.findOne({ cart_userId: userId }).lean()
        if (!userCart) {
            // create cart for user
            return await createUserCart({ userId, product })
        }
        // if have cart but it empty
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // if have cart, and product is the same then update quantity product
        return await updateUserCartQuantity({ userId, product })
    }

    /**
     * udpate cart 
     * shop_order_ids :[
     * shopId,
     * item_products:[
     *          {
            * quantity,
            * price,
            * shopId,
            * old_quantity: ,
            * productid
            * }
     * ],
     * version: 
     * ]
     */
    static async addToCartV2({ userId, product = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        // check product
        const foundProduct = await findProduct({ productId })
        if (!foundProduct) throw new NotFoundError("Product not exist")

        // Compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('The product not belong to the shop')
        }

        if (quantity === 0) {
            // deleted
        }
        return await updateUserCartQuantity({
            userId, product: {
                productId,
                quantity: quantity - old_quantity
            }
        })


    }

    static async deleteUserCart({ userId, productId }) {
        return deleteUserCart({ userId, productId })
    }

    static async getListUserCart({ userId, product = {} }) {
        return await cart.findOne({
            cart_userId: userId
        }).lean()
    }

}
module.exports = CartService
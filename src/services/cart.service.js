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
        const userCart = await cartModel.findOne({ cart_userId: userId })

        const foundProduct = await findProduct({ product_id: product.productId })
        const { product_name, product_price, product_shop } = foundProduct
        product.name = product_name;
        product.price = product_price;
        product.shopId = product_shop;

        if (!userCart) {
            // create cart for user
            return await createUserCart({ userId, product })
        }

        // if have cart but it empty
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // Check if product already exists in cart 
        const existingProduct = userCart.cart_products.find(p => p.productId === product.productId)

        if (existingProduct) { return await updateUserCartQuantity({ userId, product }) }
        else {
            // Add new product to cart 
            userCart.cart_products.push(product)
            return await userCart.save()
        }

    }

    /**
     * udpate cart 
     * shop_order_ids :{
     * shopId,
     * item_products:[
     *          {
            * quantity,
            * price,
            * shopId,
            * old_quantity: ,
            * productId
            * }
     * ],
     * version: 
     * }
     */
    static async addToCartV2({ userId, shop_order_ids = {} }) {

        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await findProduct({ product_id: productId })

        if (!foundProduct) throw new NotFoundError("Product not exist")

        // Compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('The product not belong to the shop')
        }

        if (quantity === 0) {
            return deleteUserCart({ userId, productId })
        }

        return await updateUserCartQuantity({
            userId,
             product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }) {
        return deleteUserCart({ userId, productId })
    }

    static async getListUserCart({ userId }) {
        return await cartModel.findOne({
            cart_userId: userId
        }).lean()
    }

}
module.exports = CartService
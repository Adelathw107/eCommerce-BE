'use strict'

const cartModel = require("../cart.model")
const { findProduct } = require("./product.repo.")

const createUserCart = async ({ userId, product }) => {

    const foundProduct = await findProduct({ product_id: product.productId })
    const { product_name, product_price } = foundProduct
    product.name = product_name;
    product.price = product_price;
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    }
    const options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    },
        updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        },
        options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, options)
}
const deleteUserCart = async ({ userId, productId }) => {
    const query = {
        cart_userId: userId,
        cart_state: 'active'
    },
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
    return await cartModel.updateOne(query, updateSet)
}


module.exports = {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCart
}
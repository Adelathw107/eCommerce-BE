'use strict'

const { SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")

class CartController {

    /**
     * @desc add to cart for user
     * @param {int} userId 
     * @param {*} res 
     * @param {*} next 
     * @method POST
     * @url /v1/api/cart/user
     * @return
     */
    addTocCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: 'Create new Cart success',
            metaData: await CartService.addToCart(req.body)
        }).send(res)
    }

    // update + -F
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart success',
            metaData: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deleted Cart success',
            metaData: await CartService.deleteUserCart(req.body)
        }).send(res)
    }
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Cart success',
            metaData: await CartService.getListUserCart(req.query)
        }).send(res)

    }


}




module.exports = new CartController()
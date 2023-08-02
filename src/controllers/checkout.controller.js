'use strict'

const { SuccessResponse } = require("../core/success.response")
const CheckoutService = require("../services/checkout.service")
const { checkoutReview } = require("../services/checkout.service")
const { testRedis } = require("../services/redis.service")

class CheckoutController {

    /**
     * @desc add to cart for user
     * @param {int} userId 
     * @param {*} res 
     * @param {*} next 
     * @method POST
     * @url /v1/api/cart/user
     * @return
     */
    checkoutReview = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: 'Create new Checkout success',
            metaData: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
    testRedis = async (req, res, next) => {
        new SuccessResponse({
            message: 'Test Redis Success',
            metaData: await testRedis(req.body)
        }).send(res)
    }

}




module.exports = new CheckoutController()
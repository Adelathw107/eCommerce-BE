'use strict'

const { SuccessResponse } = require("../core/success.response")
const DiscountServices = require("../services/discount.service")

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Success Code generation",
            metaData: await DiscountServices.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful Code found ",
            metaData: await DiscountServices.getAllDiscountCodeByShop({
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllProductsWithDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful products found ",
            metaData: await DiscountServices.getAllProductsWithDiscountCode({
                ...req.query
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful products found ",
            metaData: await DiscountServices.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful products found ",
            metaData: await DiscountServices.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    updateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful products found ",
            metaData: await DiscountServices.updateDiscount({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    deleteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful products found ",
            metaData: await DiscountServices.deleteDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    cancelDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful products found ",
            metaData: await DiscountServices.cancelDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }


}

module.exports = new DiscountController
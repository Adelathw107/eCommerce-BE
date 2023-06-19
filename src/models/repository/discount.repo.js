'use strict'

const { unGetSelectData, getSelectData, convertToObjectIdMongodb } = require("../../utils")
const discountModel = require("../discount.model")

const findAllDiscountCodeUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { id: 1 }
    const discounts = await discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .unSelect(unGetSelectData(unSelect))
        .lean()
    return discounts
}

const findAllDiscountCodeSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { id: 1 }
    const discounts = await discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .unSelect(getSelectData(select))
        .lean()
    return discounts
}

const checkDiscountExist = async (filter) => {
    //Create index for discount code
    return await discountModel.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscountExist
}
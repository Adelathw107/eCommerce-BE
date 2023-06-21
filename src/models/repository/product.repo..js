'use strict'
const { product, electronic, clothing, furniture } = require('../../models/product.model')
const { Types: { ObjectId } } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils')

// create query 
const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
    return await product.find(query).populate('product_shop', "name email -_id")
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishesForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductsByUser = async ({ keySearch }) => {
    const regexSeacrh = new RegExp(keySearch)

    const results = await product.find({ $text: { $search: regexSeacrh }, isPublished: true },
        { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results
}


const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id)
    })

    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount;
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id)
    })

    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    console.log(modifiedCount);
    return modifiedCount;
}

const findAllProducts = async ({ limit = 50, sort, page = 1, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}
const findProduct = async ({ product_id, unSelect = [] }) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect)).lean()
}

const updateProductById = async ({
    productId,
    payload,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, payload, {
        new: isNew
    })
}


module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishesForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProductById
}
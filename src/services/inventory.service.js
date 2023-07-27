'use strict'

const { BadRequestError } = require("../core/error.response")
const inventoryModel = require("../models/inventory.model")
const { findProduct } = require("../models/repository/product.repo.")

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "134, Tran Phu , HCM city"
    }) {
        const product = await findProduct(productId)
        if (!product) throw new BadRequestError("The product does not exist")

        const query = {
            inven_shopId: shopId,
            inven_productId: productId
        },
            updateSet = {
                $inc: {
                    inven_stock: stock
                },
                $set: {
                    inven_location: location
                }
            },
            options = {
                upsert: true, new: true
            }

        return await inventoryModel.findOneAndUpdate(query, updateSet, options)
    }

}

module.exports = InventoryService 

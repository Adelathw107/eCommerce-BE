'use strict'

const { SuccessResponse } = require("../core/success.response")
const InventoryService = require("../services/inventory.service")

class InventoryController {

    addStockInventory = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create new Cart addStockToInventory',
            metaData: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController
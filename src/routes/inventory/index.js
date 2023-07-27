"use strict";

const router = require("express").Router();

const { authenticationV2 } = require("../../auth/authUtils.js");
const inventoryController = require("../../controllers/inventory.controller.js");
const { asyncHandler } = require("../../helpers/asyncHandler.js");

router.use(authenticationV2)
// user get amount a discount
router.post('', asyncHandler(inventoryController.addStockInventory))

module.exports = router;

"use strict";

const router = require("express").Router();

const { authenticationV2 } = require("../../auth/authUtils.js");
const discountController = require("../../controllers/discount.controller.js");
const { asyncHandler } = require("../../helpers/asyncHandler.js");

// user get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllProductsWithDiscountCode))

// authentication
router.use(authenticationV2)
////////////////////////////////

// get
router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router;

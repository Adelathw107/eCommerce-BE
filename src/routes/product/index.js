"use strict";

const router = require("express").Router();

const { authenticationV2 } = require("../../auth/authUtils.js");
const productController = require("../../controllers/product.controller.js");
const { asyncHandler } = require("../../helpers/asyncHandler.js");


// authentication
router.use(authenticationV2)

// create 
router.post('', asyncHandler(productController.createProduct))

module.exports = router;

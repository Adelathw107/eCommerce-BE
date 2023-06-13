"use strict";

const router = require("express").Router();

const { authenticationV2 } = require("../../auth/authUtils.js");
const productController = require("../../controllers/product.controller.js");
const { asyncHandler } = require("../../helpers/asyncHandler.js");

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

// authentication
router.use(authenticationV2)
////////////////////////////////

// post 
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))


// get
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishesForShop))

module.exports = router;

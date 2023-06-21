'use strict';

const router = require('express').Router();

const { authenticationV2 } = require('../../auth/authUtils.js');
const cartController = require('../../controllers/cart.controller.js');

const { asyncHandler } = require('../../helpers/asyncHandler.js');

// signup
router.post('', asyncHandler(cartController.addTocCart));
router.delete('', asyncHandler(cartController.delete))
router.post('/', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.listToCart))

module.exports = router;

'use strict';

const router = require('express').Router();

const checkoutController = require('../../controllers/checkout.controller.js');

const { asyncHandler } = require('../../helpers/asyncHandler.js');

// signup
router.post('/review', asyncHandler(checkoutController.checkoutReview));

module.exports = router;

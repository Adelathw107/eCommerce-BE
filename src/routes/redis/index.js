'use strict';

const router = require('express').Router();


const checkoutController = require('../../controllers/checkout.controller.js');
const { asyncHandler } = require('../../helpers/asyncHandler.js');

// test redis
router.get('', asyncHandler(checkoutController.testRedis));

module.exports = router;

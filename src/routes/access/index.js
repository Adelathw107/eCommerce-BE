"use strict";

const router = require("express").Router();

const { authenticationV2 } = require("../../auth/authUtils.js");
const accessController = require("../../controllers/access.controller.js");
const { asyncHandler } = require("../../helpers/asyncHandler.js");

// signup
router.post("/shop/signup", asyncHandler(accessController.signUp));

// login
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authenticationV2)
// logout
router.post("/shop/logout", asyncHandler(accessController.logout));

router.post("/shop/handlerRefreshToken", asyncHandler(accessController.handlerRefreshToken));


module.exports = router;

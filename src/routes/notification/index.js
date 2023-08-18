'use strict';

const router = require('express').Router();

const { authenticationV2 } = require('../../auth/authUtils.js');
const notificationControlller = require('../../controllers/notification.controlller.js');

const { asyncHandler } = require('../../helpers/asyncHandler.js');

router.use(authenticationV2)

// get notification
router.get('', asyncHandler(notificationControlller.listNotiByUser));

module.exports = router;

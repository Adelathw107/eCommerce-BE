'use strict';

const { apiKey, permission } = require('../auth/checkAuth');

const router = require('express').Router();

// Check api key 
router.use(apiKey)

// check permission
router.use(permission('0000'))

// routes
router.use('/v1/api', require('./access'));
router.use('/v1/api/product', require('./product'));



module.exports = router;

"use strict"

const router = require("express").Router();
// Check api key 


// check permission



router.use("/v1/api", require("./access"));

module.exports = router;

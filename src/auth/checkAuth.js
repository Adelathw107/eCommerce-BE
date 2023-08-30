'use strict';

const { findById } = require("../services/apiKey.service");


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORZATION: 'authorization'
};
const apiKey = async (req, res, next) => {

    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error1"
            });
        }
        // check ojkey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error2"
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.error(`Error:: `, error);
    }
};
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Dinied"
            });
        }
        console.log(`permission:: `, req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'perrmission denied'
            });
        }
        return next();
    };
};

module.exports = {
    apiKey, permission
};

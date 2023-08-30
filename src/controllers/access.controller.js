'use strict';

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: "Get token success",
        //     metaData: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)

        // v2 Fixed, no need accesstoken
        new SuccessResponse({
            message: "Get token success",
            metaData: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res);
    };

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout success",
            metaData: await AccessService.logout(req.keyStore)
        }).send(res);
    };

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Register success!",
            metaData: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);

        // return res.status(201).json(await AccessService.signUp(req.body))
    };

    login = async (req, res, next) => {
        new SuccessResponse({
            metaData: await AccessService.login(req.body)
        }).send(res);
    };
}
module.exports = new AccessController();
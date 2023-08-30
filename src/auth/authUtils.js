'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
};


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        // Verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err);
            } else {
                console.log(`decode verify:: `, decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
    }
};


const authenticationV2 = asyncHandler(async (req, res, next) => {
    /*
          1 - Check userId missing?
          2 - Get accessToken
          3 - verifyToken
          4 - check user in dbs
          5 - check keyStore with this userId?
          6 - OK all => return next() 
      */

    // 1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request");

    // 2
    const keyStore = await findByUserId(userId);

    if (!keyStore) throw new NotFoundError("Not found KeyStore");


    // 3.
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = verifyJWT(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid UserId");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORZATION];

    if (!accessToken) throw new AuthFailureError('Invalid Request');

    try {
        const decodeUser = verifyJWT(accessToken, keyStore.publicKey, (err) => {
            if (err) {
                console.error(`error verify::`, err);
            }
        });
        if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid UserId");
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        throw error;
    }
});

const verifyJWT = (token, keySecret) => {
    return JWT.verify(token, keySecret);
};

module.exports = {
    createTokenPair,
    verifyJWT,
    authenticationV2
}


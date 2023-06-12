'use strict'
const shopModel = require('../models/shop.model.js')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require('./keyToken.service.js')
const { createTokenPair, verifyJWT } = require('../auth/authUtils.js')
const { getInfoData } = require('../utils/index.js')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response.js')
const { findByEmail } = require('./shop.service.js')

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {

    static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {

        const { userId, email } = user

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happen !! Please relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registed')

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError("Shop not registed")


        // Check xem token nay da duoc su dung chua
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {

            //  decode xem la ai dag truy cap
            const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey)

            console.log({ userId, email });

            // xoa
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happen !! Please relogin')
        }

        
        // NO, good, account is safe
        const holderToken = await keyTokenService.findByRefreshToken(refreshToken)

        // create new tokens
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        // update tokens
        holderToken.refreshToken = tokens.refreshToken
        holderToken.refreshTokensUsed.push(refreshToken)
        await holderToken.save()

        return {
            shop: { userId, email },
            tokens
        }
    }


    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey;
    }


    /*
    1 - Check email
    2 - match password
    3 - create AToken vs RToken
    4 - generate token
    5 - get data return login
    */

    static login = async ({ email, password, refreshToken = null }) => {

        const foundShop = await findByEmail({ email })
        // 1.
        if (!foundShop)
            throw new BadRequestError("Shop is not correct!")

        // 2.
        const match = await bcrypt.compare(password, foundShop.password)

        if (!match) throw new AuthFailureError("Password is not correct")

        // 3.
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // 4.
        const { _id: userId } = foundShop

        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await keyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey, publicKey
        })

        // 5.
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }

    }


    static signUp = async ({ name, email, password }) => {

        // step 1: Check mail exist ?
        const holdelShop = await shopModel.findOne({ email }).lean()

        if (holdelShop) {
            throw new BadRequestError("Error:: Shop already register")
        }
        const passwordHashed = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: passwordHashed, roles: [roleShop.SHOP]
        })

        if (newShop) {

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');


            console.log({ privateKey, publicKey }) // save collection KeyStore

            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey
            })

            if (!keyStore) {
                throw new BadRequestError("Error:: KeyStore is error")
            }
            // const publicKeyObject = crypto.createPublicKey(publicKeyString)

            // create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

            console.log(`Created Token Success ::`, tokens);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService
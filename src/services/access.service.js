"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: Check email exists
      const hodelShop = await shopModel.findOne({ email }).lean();

      if (hodelShop) {
        return {
          code: "xxx",
          message: "Shop already registered!",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // created privateKey, publicKey
        // ADVANCED: for big web => amazon, google,...
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 2048,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   // Public key CryptoGraphy Standards!
        // });

        // BASIC: use often for smaller web
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        console.log({ privateKey, publicKey });

        // ADVANCED
        // const publicKeyString = await KeyTokenService.createKeyToken({
        // BASIC
        const keyStore = await KeyTokenService.createKeyToken({
          userid: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "keyStore error",
          };
        }
        // ADVANCED
        // console.log("publicKeyString::", publicKeyString);
        // const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // console.log("publicKeyObject::", publicKeyObject);

        // BASIC
        // created token pair
        const tokens = await createTokenPair(
          { userid: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log("Created Token Success:: ", tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;

"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {

  static createKeyToken = async ({ userid, publicKey, privateKey }) => {
    try {
      // ADVANCED
      // const publicKeyString = publicKey.toString();

      // BASIC
      const tokens = await keytokenModel.create({
        user: userid,
        publicKey,
        privateKey
      });

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;

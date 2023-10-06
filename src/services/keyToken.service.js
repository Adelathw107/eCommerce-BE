"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userid, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keytokenModel.create({
        user: userid,
        publicKey: publicKeyString,
      });
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;

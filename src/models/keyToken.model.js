'use strict';
const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'KEY'
const COLLECTION_NAME = 'keys'

// Declare Schema of the Mongo Model
const keyTokenSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Shop"
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: [] // Những refreshToken used 
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamp: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
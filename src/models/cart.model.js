'use strict';
const { Schema, model } = require('mongoose');
/**
 * @field
 * cart_state
 */

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'
const cartSchema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pednding'],
        default: 'active'
    },
    cart_products: { type: Array, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },

}, {
    timeseries: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, cartSchema)
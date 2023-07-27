'use strict';
const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'ORDER'
const COLLECTION_NAME = 'Orders'

// Declare Schema of the Mongo Model
const OrderSchema = Schema({
    order_userId: { type: Number, required: true },
    order_checkout: {
        type: Object,
        default: {}
    },

    /**
     * order_checkout={
     * totalPrice
     * totalApplyDisCount
     * feeShip
     * }
     */

    order_shipping: {
        type: Object,
        default: {}

        /**
         * street, 
         * city,
         * state,
         * country
         */

    },

    order_payment: {
        type: Object,
        default: {

        }
    },

    order_product: {
        type: Array,
        required: true
    },

    order_trackingNumber: {
        type: String,
        default: '#0000118052023'
    },

    order_status: {
        type: String,
        enum: ['pending', 'confirm', 'shipped', 'cancelled', 'delivered'],
        default: 'pednding'
    }

}, {

    timestamp: true,
    collection: COLLECTION_NAME

});

module.exports = model(DOCUMENT_NAME, OrderSchema);
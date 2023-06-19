'use strict';
const { Schema, model } = require('mongoose');

/**
 * @field
 * name
 * desc
 * type
 * code 
 * end ,start date
 * max uses
 * uses count
 * users_used
 * max_uses_per_users
 * min_oerder_value
 * shopId
 * is_active
 * applies_to
 * product_ids
 */

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
const discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        enum: ['fixed_amount', 'percentage'],
        default: "fixed_amount" //percentage
    },
    discount_value: {
        type: Number,
        required: true   //10.00 
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: { type: Date, required: true },// start day
    discount_end_date: { type: Date, required: true }, // end day
    discount_max_uses: { type: Number, required: true }, // Number of Discount 
    discount_uses_count: { type: Number, required: true }, //  Count Discount used
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_users: { type: Number, required: true }, // So luong cho phep toi da
    discount_min_order_value: { type: Number, required: true },
    discount_max_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] } // Nhung san pham duoc ap dung
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema);
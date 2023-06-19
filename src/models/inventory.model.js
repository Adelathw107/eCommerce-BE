'use strict';
const { Schema, model } = require('mongoose');
/**
 * @field
 * poruductId 
 * location 
 * stock 
 * shopId 
 * reservations
 */

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
const InventorySchema = new Schema({
    inven_poruductId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unKnow" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, InventorySchema);
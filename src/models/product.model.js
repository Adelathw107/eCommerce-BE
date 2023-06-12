'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: {
        type: String
    },
    product_slug: {
        type: String // 
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furnitures']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    // More
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be under 5.0"],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    },


}, {
    timestamp: true,
    collection: COLLECTION_NAME
});

// define the product type = clothing

const clothingSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronic

const electronicSchema = new Schema({
    manufacture: {
        type: String,
        require: true
    },
    model: String,
    color: String
}, {
    collection: 'electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
    manufacture: {
        type: String,
        require: true
    },
    model: String,
    color: String
}, {
    collection: 'furniture',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema)
}


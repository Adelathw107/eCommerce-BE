'use strict';

const { logger } = require("../configs/config.logger");
const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic, furniture } = require("../models/product.model");
const { insertInventory } = require("../models/repository/inventory.repo");
const { findAllDraftsForShop, publishProductByShop, findAllPublishesForShop, searchProductsByUser, unPublishProductByShop, findAllProducts, findProduct, updateProductById } = require("../models/repository/product.repo.");
const { removeUnderfinedObject, updateNestedObjectParser } = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

// define Factory class to create product
class ProductFactoryV2 {
    /**
     *Type : "CLothing",
     * payload
     */
    static productRegistry = {}; //key~class

    static registerProductType(type, classRef) {
        ProductFactoryV2.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactoryV2.productRegistry[type];

        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);

        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, payload, productId) {
        const productClass = ProductFactoryV2.productRegistry[type];

        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);

        return new productClass(payload).updateProduct(productId);
    }

    // PUT 
    static async publishProductByShop({ product_shop, product_id }) { return await publishProductByShop({ product_shop, product_id }); }
    static async unPublishProductByShop({ product_shop, product_id }) { return await unPublishProductByShop({ product_shop, product_id }); }
    // END PUT

    // Query 
    /**
     * Get all draftsProducts
     * @param {*}  
     * @returns {JSON}
     */
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    /**
        * Get all published Products
        * @param {*}  
        * @returns {JSON}
    */
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishesForShop({ query, limit, skip });
    }

    static async searchProductsByUser(keySearch) {
        return await searchProductsByUser({ keySearch });
    }

    static async findAllProducts(limit = 50, sort = "ctime", page = 1, filter = { isPublished: true }) {

        return await findAllProducts({
            limit, sort, page, filter, select: [
                'product_name',
                'product_price',
                'product_thumb'
            ]
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] });
    }
}


// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create new product
    async createProduct(_id) {
        const newProduct = await product.create({ ...this, _id: _id });

        if (newProduct) {
            // add product_stock in inventory
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            });
            // notificate to subscriber
            pushNotiToSystem({
                type: 'SHOP-001',
                recievedId: 1,
                senderId: this.product_shop,
                options: {
                    'product_name': this.product_name,
                    'shop_name': this.product_shop
                }
            }).then(rs => console.log("resultt:::", rs))
                .catch(logger.error);
        }
        return newProduct;
    }


    async updateProduct(productId, payload) {
        return await updateProductById({ productId, payload, model: product });
    }

}


// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) throw new BadRequestError('create new Clothig error');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('create new Clothing error');

        return newProduct;
    }

    async updateProduct(productId) {
        // 1. Remove attr has null or underfined
        const nestedPayload = updateNestedObjectParser(this);
        console.log(nestedPayload);
        const objectparams = removeUnderfinedObject(nestedPayload);
        console.log(`[2] yep :::`, objectparams);

        const updateProduct = await super.updateProduct(productId, objectparams);
        console.log(updateProduct.product_attributes);
        // 2. Check xem update where ?
        if (this.product_attributes) {
            // update child
            await updateProductById({
                productId,
                payload: updateProduct.product_attributes,
                model: clothing
            });
        }


        return updateProduct;
    }

}

// define sub-class for different product types Electronic

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }
        );
        if (!newElectronic) throw new BadRequestError('create new Clothing error');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('create new Clothing error');

        return newProduct;
    }
    async updateProduct(productId) {
        // 1. Remove attr has null or underfined
        const objectparams = removeUnderfinedObject(this);

        // 2. Check xem update where ?
        if (objectparams.product_quantity) {
            // update child
            await updateProductById({ productId, objectparams, model: electronic });
        }

        const updateProduct = await super.updateProduct(productId, objectparams);
        return updateProduct;
    }
}


// define sub-class for different product types Furniture
class Furnitures extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }
        );
        if (!newFurniture) throw new BadRequestError('create new Clothing error');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('create new Clothing error');

        return newProduct;
    }
    async updateProduct(productId) {
        // 1. Remove attr has null or underfined
        const objectparams = removeUnderfinedObject(this);

        // 2. Check xem update where ?
        if (objectparams.product_quantity) {
            // update child
            await updateProductById({ productId, objectparams, model: furniture });
        }

        const updateProduct = await super.updateProduct(productId, objectparams);
        return updateProduct;
    }
}

// register product types
ProductFactoryV2.registerProductType('Electronics', Electronics);
ProductFactoryV2.registerProductType('Clothing', Clothing);
ProductFactoryV2.registerProductType('Furnitures', Furnitures);


module.exports = ProductFactoryV2;
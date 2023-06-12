'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic, furniture } = require("../models/product.model")

// define Factory class to create product
class ProductFactoryV2 {

    /**
     *Type : "CLothing",
     * payload
     */
    static productRegistry = {

    } //key~class

    static registerProductType(type, classRef) {
        ProductFactoryV2.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        console.log(type);
        const productClass = ProductFactoryV2.productRegistry[type]

        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productClass(payload).createProduct()
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
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct(_id) {

        return await product.create({ ...this, _id: _id })
    }

}

// define sub-class for different product types Clothing

class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothig error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new Clothig error')

        return newProduct
    }
}

// define sub-class for different product types Electronic

class Electronics extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }
        )
        if (!newElectronic) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new Clothing error')

        return newProduct
    }
}

// define sub-class for different product types Furniture

class Furnitures extends Product {

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }
        )
        if (!newFurniture) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new Clothing error')

        return newProduct
    }
}

// register product types
ProductFactoryV2.registerProductType('Electronics', Electronics)
ProductFactoryV2.registerProductType('Clothing', Clothing)
ProductFactoryV2.registerProductType('Furnitures', Furnitures)


module.exports = ProductFactoryV2
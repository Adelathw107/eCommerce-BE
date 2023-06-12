"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");


class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product",
      metaData: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId // req.user in authjs
      })
    }).send(res)
  }
}

module.exports = new ProductController();

"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
// const ProductFactory = require("../services/product.service");
const ProductFactoryV2 = require("../services/product.service.xx");


class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success",
      metaData: await ProductFactoryV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId // req.user in authjs
      })
    }).send(res)
  }


  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product success",
      metaData: await ProductFactoryV2.updateProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId // req.user in authjs
      }, req.params.productId)
    }).send(res)
  }

  // QUERY 
  /**
   * @desc Get all drafts for shop
   * @param {Number} limit = 50
   * @param {Number} skip  = 0
   * @return  {JSON } 
   */

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success",
      metaData: await ProductFactoryV2.findAllDraftsForShop({ product_shop: req.user.userId })
    }).send(res)
  }

  getAllPublishesForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success",
      metaData: await ProductFactoryV2.findAllPublishForShop({ product_shop: req.user.userId })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get getListSearchProduct success",
      metaData: await ProductFactoryV2.searchProductsByUser(req.params.keySearch)
    }).send(res)
  }
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get findAllProducts success",
      metaData: await ProductFactoryV2.findAllProducts()
    }).send(res)
  }
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get findProduct success",
      metaData: await ProductFactoryV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
  // END QUERY 


  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Change product to publish Success!!!",
      metaData: await ProductFactoryV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.productId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Change product to publish Success!!!",
      metaData: await ProductFactoryV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.productId
      })
    }).send(res)
  }

}




module.exports = new ProductController();

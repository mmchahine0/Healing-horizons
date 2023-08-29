const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const productController = require("../controllers/productController.js");

router.post(
  '/create-product',
  authController.protect,
  productController.createProduct
);

router.patch(
  "/update-product/:productID",
  authController.protect,
  productController.updateProduct
);

router.delete(
  "/delete-product/:productID",
  authController.protect,
  productController.deleteProduct
);

router.get(
  "/all-products",
  productController.getAllProducts
);

module.exports = router;
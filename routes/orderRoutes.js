const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const orderController = require("../controllers/orderController.js");

router.post(
  "/new-order",
  authController.protect,
  orderController.createNewOrder
);
router.post(
  "/update-order",
  authController.protect,
  orderController.updateOrderStatus
);

module.exports = router;
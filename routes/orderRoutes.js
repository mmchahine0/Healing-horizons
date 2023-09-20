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
  "/update-order/:orderId",
  authController.protect,
  orderController.updateOrderStatus
);
router.get(
  "/get-order",
  authController.protect,
  orderController.getOrdersForUser
);

module.exports = router;
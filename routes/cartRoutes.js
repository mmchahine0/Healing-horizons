const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const cartController = require('../controllers/cartController.js');

router.post("/add-to-cart", authController.protect, cartController.addToCart)
router.get("/content", authController.protect, cartController.getCartContent);

module.exports = router;
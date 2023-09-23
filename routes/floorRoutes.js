const express = require('express');
const router = express.Router();
const floorController = require("../controllers/floorController",)
const authController = require("../controllers/authController");

router.post('/create', authController.protect, floorController.createFloor);
router.get('/get/:floorNumber', authController.protect, floorController.getFloorData);

module.exports = router;
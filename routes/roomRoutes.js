const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController'); // Replace with the correct path to your controller
const authController = require('../controllers/authController');

router.post('/create', authController.protect, roomController.createRoom);

module.exports = router;
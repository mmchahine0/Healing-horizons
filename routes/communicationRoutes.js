const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController.js');
const authController = require('../controllers/authController.js');

router.post('/send-email', authController.protect, communicationController.sendEmail);


module.exports = router;
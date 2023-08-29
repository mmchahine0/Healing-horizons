const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController.js');

router.post('/send-email', communicationController.sendEmail);


module.exports = router;
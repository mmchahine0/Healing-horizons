const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const uploadImage = require('../controllers/uploadController.js');

router.post("/profile-pic", authController.protect, uploadImage.uploadImage, uploadImage.uploadToS3);

module.exports = router;
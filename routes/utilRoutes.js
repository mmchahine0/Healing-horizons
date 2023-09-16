const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const uploadImage = require('../controllers/uploadController.js');

router.post('/uploadProductimg', authController.protect, uploadImage.uploadProductPicture);
router.post('/uploadProfileimg', authController.protect, uploadImage.uploadProfilePicture);

module.exports = router;
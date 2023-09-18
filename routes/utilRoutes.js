const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const uploadImage = require('../controllers/uploadController.js');

router.post(
  '/uploadProductimg/:productId',
  authController.protect,
  uploadImage.uploadImage,
  uploadImage.uploadProductPicture
);

router.post(
  '/uploadProfileimg/:userId',
  authController.protect,
  uploadImage.uploadImage,
  uploadImage.uploadProfilePicture
);

module.exports = router;

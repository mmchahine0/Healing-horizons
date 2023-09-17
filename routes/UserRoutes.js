const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/getUser/:userId', authController.protect, userController.getUserById);
router.get('/ownUser', authController.protect, userController.getOwnUser);

module.exports = router;

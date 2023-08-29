const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/updatePasssword/:userId', authController.updatePassword);
router.patch('/forgotPasssword/:userId', authController.protect, authController.forgotPassword);
router.get("/allusers", authController.protect, authController.getAllUsers);
module.exports = router;
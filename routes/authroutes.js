const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post("/make-doctor", authController.protect, authController
  .checkAdmin, authController.makeDoctor);
router.patch('/updatePasssword/:userId', authController.protect, authController.updatePassword);
router.patch('/forgotPasssword/:userId', authController.forgotPassword);
router.get("/allusers", authController.protect, authController.getAllUsers);


module.exports = router;

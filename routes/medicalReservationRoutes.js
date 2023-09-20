const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/medicalReservation');
const authController = require('../controllers/authController');

router.post('/request', authController.protect, reservationController.requestMedication);
router.get('/get', authController.protect, reservationController.getAllRequestsForDoctor)

module.exports = router;
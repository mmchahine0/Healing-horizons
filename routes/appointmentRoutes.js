const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authController = require('../controllers/authController');

router.post('/book', authController.protect, appointmentController.bookAppointment);
router.delete('/cancel/:appointmentId', authController.protect, appointmentController.cancelAppointment);
router.get('/get/:userId', authController.protect, appointmentController.getAppointments)

module.exports = router;
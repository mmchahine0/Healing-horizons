const express = require('express');
const router = express.Router();
const roomReservationController = require('../controllers/roomReservationController.js');
const authController = require('../controllers/authController.js');

router.post('/reserve', authController.protect, roomReservationController.reserveRoom);
router.get('/reservations', authController.protect, roomReservationController.getRoomReservations);

module.exports = router;
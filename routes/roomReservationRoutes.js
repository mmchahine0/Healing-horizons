const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const roomReservationController = require('../controllers/roomReservationController');

router.post('/reserve-room', authController.protect, roomReservationController.reserveRoom);
router.get('/room-reservations', authController.protect, roomReservationController.getRoomReservations);

module.exports = router;
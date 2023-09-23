const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const roomReservationController = require('../controllers/roomReservationController');

router.post('/reserve-room/:roomId', authController.protect, roomReservationController.reserveRoom);
router.get('/get', authController.protect, roomReservationController.getRoomReservations);
router.get('/getAvailableRooms', authController.protect, roomReservationController.getAvailableRooms);

module.exports = router;
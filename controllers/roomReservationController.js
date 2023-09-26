const RoomReservation = require('../models/roomReservationModel');
const Cart = require('../models/MedSellingModels/cartModel');
const Floor = require("../models/floorModel");
const moment = require('moment');
const room = require('../models/roomModel');
const mongoose = require('mongoose');

const calculateRoomReservationPrice = (checkInDate, checkOutDate) => {
  try {
    const dailyPrice = 100; // Adjust this based on your actual pricing logic
    const numberOfDays = moment(checkOutDate).diff(moment(checkInDate), 'days');
    const totalPrice = dailyPrice * numberOfDays;
    return totalPrice;
  } catch (error) {
    console.error('Error calculating room reservation price:', error);
    throw error;
  }
};

const AvailableRooms = async (checkInDate, checkOutDate) => {
  try {
    const count = await room.countDocuments({
      status: 'available',
      $or: [
        {
          $and: [{ checkInDate: { $gte: checkInDate } }, { checkInDate: { $lt: checkOutDate } }]
        },
        {
          $and: [{ checkOutDate: { $gt: checkInDate } }, { checkOutDate: { $lte: checkOutDate } }]
        }
      ]
    });
    return count;
  } catch (error) {
    console.error('Error counting available rooms:', error);
    throw error;
  }
};


exports.reserveRoom = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { checkInDate, checkOutDate } = req.body;
    const { roomId } = req.params;

    // Check if the requested room exists
    const roomCheck = await room.findById(roomId);

    if (!roomCheck) return res.status(404).json({ message: "room not found" });

    // Check if the room is already occupied
    if (roomCheck.status === "occupied") return res.status(404).json({ message: "room occupied" });

    // Format the check-in and check-out dates
    const formattedCheckInDate = moment(checkInDate).format('YYYY-MM-DDTHH:mm');
    const formattedCheckOutDate = moment(checkOutDate).format('YYYY-MM-DDTHH:mm');

    // Check if the date inputs are valid
    if (!moment(formattedCheckInDate, 'YYYY-MM-DDTHH:mm').isValid() || !moment(formattedCheckOutDate, 'YYYY-MM-DDTHH:mm').isValid()) {
      return res.status(400).json({ message: "Invalid reservation date format" });
    }

    // Check if there are available rooms for the requested dates
    const availableRoomsCount = await AvailableRooms(checkInDate, checkOutDate);

    if (availableRoomsCount <= 0) {
      return res.status(409).json({ message: "Sorry, no rooms are available for the selected dates" });
    }

    // Calculate the room reservation price
    let roomReservationPrice = calculateRoomReservationPrice(checkInDate, checkOutDate);

    // Check if the calculated price is valid
    if (isNaN(roomReservationPrice) || roomReservationPrice < 0) {
      return res.status(400).json({ message: 'Invalid room reservation price' });
    }

    // Create a new room reservation
    const newReservation = new RoomReservation({
      user: req.user._id, // Assuming req.user._id is the user's ID
      roomId,
      checkInDate,
      checkOutDate,
      Price: roomReservationPrice,
      status: 'pending',
    });

    // Update the room status to 'occupied'
    roomCheck.status = "occupied";

    // Save the new reservation and update the room status
    await newReservation.save({ session: session });
    await roomCheck.save({ session: session });

    const floor = await Floor.findOne({ rooms: roomId }).session(session);

    // Decrease the available room count on the floor
    if (floor) {
      floor.availableQuantity -= 1;
      await floor.save({ session: session });
    }

    // Commit the transaction and send a success message
    await session.commitTransaction();
    res.status(200).json({ message: 'Room reservation successful. Please complete your payment to confirm the reservation.' });
  } catch (error) {
    console.error(error);
    // Rollback the transaction in case of an error and send an error message
    await session.abortTransaction();
    res.status(500).json({ message: 'Something went wrong' });
  } finally {
    // End the session
    session.endSession();
  }
};


exports.getRoomReservations = async (req, res) => {
  try {
    const rooms = await RoomReservation.find();
    if (users.length == 0) {
      return res.status(404).json({ message: "No room reservations found" });
    }
    return res.status(200).json({ message: "room reservations", data: rooms });
  } catch (err) {
    console.log(err)
  }
}

exports.getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await room.find({ status: "available" });
    return res.status(200).json({ message: "Available rooms", data: availableRooms });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

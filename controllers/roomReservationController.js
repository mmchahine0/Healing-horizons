const RoomReservation = require('../models/roomReservationModel');
const Cart = require('../models/MedSellingModels/cartModel');
const Floor = require("../models/floorModel");
const moment = require('moment');
const room = require('../models/roomModel');
const mongoose = require('mongoose');

exports.reserveRoom = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { roomId, checkInDate, checkOutDate } = req.body;

    // Check if the requested room exists
    const roomCheck = await room.findById(roomId);

    if (!roomCheck) return res.status(404).json({ message: "room not found" });

    // Check if the room is already occupied
    if (roomCheck.status == "occupied") return res.status(404).json({ message: "room occupied" });

    // Format the check-in and check-out dates
    const formattedCheckInDate = moment(checkInDate).format('YYYY-MM-DDTHH:mm');
    const formattedCheckOutDate = moment(checkOutDate).format('YYYY-MM-DDTHH:mm');

    // Check if the date inputs are valid
    if (!moment(formattedCheckInDate, 'YYYY-MM-DDTHH:mm').isValid() || !moment(formattedCheckOutDate, 'YYYY-MM-DDTHH:mm').isValid()) {
      return res.status(400).json({ message: "Invalid reservation date format" });
    }

    const cartOwner = req.user._id;
    // Find the user's cart and create one if it doesn't exist
    let cart = await Cart.findOne({ cartOwner }).session(session);

    if (!cart) {
      cart = await Cart.create(
        [
          {
            cartOwner: cartOwner,
            totalPrice: 0,
          },
        ],
        { session: session }
      )[0];
    }

    // Check if there are available rooms for the requested dates
    const availableRooms = await getAvailableRooms(checkInDate, checkOutDate).session(session);

    if (availableRooms <= 0) {
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
      user: cartOwner,
      roomId,
      checkInDate,
      checkOutDate,
      Price: roomReservationPrice,
      status: 'pending',
    });

    // Update the cart's total price and mark the room as occupied
    cart.totalPrice += roomReservationPrice;
    roomCheck.status = "occupied";

    // Save the new reservation, update the cart, and decrease available room count
    await newReservation.save({ session: session });
    await roomCheck.save({ session: session });
    cart.roomReservation.push(newReservation._id);
    await cart.save({ session: session });

    const floor = await Floor.findOne({ rooms: roomId }).session(session);

    // Decrease the available room count on the floor
    if (floor) {
      floor.availableQuantity -= 1;
      await floor.save({ session: session });
    }

    // Commit the transaction and send a success message
    await session.commitTransaction();
    res.status(200).json({ message: 'Room reservation added to cart. Please complete your payment to confirm the reservation.' });
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

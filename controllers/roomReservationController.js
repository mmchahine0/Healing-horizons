const RoomReservation = require('../models/roomReservationModel');
const Cart = require('../models/MedSellingModels/cartModel');
const Floor = require("../models/floorModel");
const moment = require('moment');
const room = require('../models/roomModel');

const calculateRoomReservationPrice = (checkInDate, checkOutDate) => {
  // Parse the ISO 8601 date strings into JavaScript Date objects
  const checkInDateTime = new Date(checkInDate);
  const checkOutDateTime = new Date(checkOutDate);

  // Calculate the time difference in milliseconds between check-in and check-out
  const timeDifference = checkOutDateTime - checkInDateTime;

  // Calculate the number of days (rounded up)
  const numberOfDays = Math.ceil(timeDifference / (24 * 60 * 60 * 1000)); // Milliseconds in a day

  const basePricePerDay = 50.0; // $50 per day
  const totalPrice = basePricePerDay * numberOfDays;

  return totalPrice;
};

const getAvailableRooms = async (checkInDate, checkOutDate) => {
  try {
    const reservedRooms = await RoomReservation.find({
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
      status: { $in: ['pending', 'reserved', 'checked-in'] },
    });

    const allFloors = await Floor.find({});

    // Calculate the total quantity of rooms across all floors
    const totalRooms = allFloors.reduce((total, floor) => total + floor.totalQuantity, 0);

    // Calculate the number of reserved rooms
    const totalReservedRooms = reservedRooms.length;

    // Calculate available rooms
    const availableRooms = totalRooms - totalReservedRooms;

    return availableRooms;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.reserveRoom = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const roomCheck = await room.findById(roomId);
    if (!roomCheck) return res.status(404).json({ message: "room not found" })
    if (roomCheck.status == "occupied") return res.status(404).json({ message: "room occupied" })

    // Format the check-in and check-out dates to include a time component in HH:mm format
    const formattedCheckInDate = moment(checkInDate).format('YYYY-MM-DDTHH:mm');
    const formattedCheckOutDate = moment(checkOutDate).format('YYYY-MM-DDTHH:mm');

    // Check if the date inputs are valid
    if (!moment(formattedCheckInDate, 'YYYY-MM-DDTHH:mm').isValid() || !moment(formattedCheckOutDate, 'YYYY-MM-DDTHH:mm').isValid()) {
      return res.status(400).json({ message: "Invalid reservation date format" });
    }
    // Check if the user's cart has unpaid orders
    const cartOwner = req.user._id;
    let cart = await Cart.findOne({ cartOwner });
    if (!cart) {
      cart = await Cart.create({
        cartOwner: cartOwner,
        totalPrice: 0,
      });
    }

    const availableRooms = await getAvailableRooms(checkInDate, checkOutDate);
    if (availableRooms <= 0) {
      return res.status(409).json({ message: "Sorry, no rooms are available for the selected dates" });
    }

    // Calculate the total price for the room reservation based on the room type and duration

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
    cart.totalPrice += roomReservationPrice;
    roomCheck.status = "occupied";

    await newReservation.save();
    await roomCheck.save();
    // Add the room reservation to the cart
    cart.roomReservation.push(newReservation._id);
    await cart.save();

    // Decrease the available room count in the Floor schema
    const floor = await Floor.findOne({ rooms: roomId }); // Find the floor that has the room
    if (floor) {
      floor.availableQuantity -= 1; // Decrease available room count by 1
      await floor.save();
    }

    // Send a frontend message to tell the user to pay in cart to continue the reservation
    res.status(200).json({ message: 'Room reservation added to cart. Please complete your payment to confirm the reservation.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getRoomReservations = async (req, res) => {
  try {
    const userReservations = await RoomReservation.find({ user: req.user._id });
    res.status(200).json(userReservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

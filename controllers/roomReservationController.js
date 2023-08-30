const RoomReservation = require('../models/roomReservationModel');
const Cart = require('../models/MedSellingModels/cartModel'); // Import your Cart model

exports.reserveRoom = async (req, res) => {
  try {
    const { roomType, checkInDate, checkOutDate } = req.body;

    // Check if the user's cart has unpaid orders
    const cartOwner = req.user._id;
    const cart = await Cart.findOne({ cartOwner });


    // Create a new room reservation
    const newReservation = new RoomReservation({
      user: cartOwner,
      roomType,
      checkInDate,
      checkOutDate,
      status: 'pending', // Status starts as pending
    });

    await newReservation.save();

    // Add the room reservation to the cart
    cart.roomReservation.push(newReservation._id);
    await cart.save();
    //send a frontend messag to tell the user to pay in cart to countinue the reservation

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
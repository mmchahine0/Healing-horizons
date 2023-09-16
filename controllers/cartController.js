const Cart = require("../models/MedSellingModels/cartModel.js");
const User = require("../models/userModel.js");
const Product = require("../models/MedSellingModels/productModel.js");
const RoomReservation = require("../models/roomReservationModel");
const Floor = require("../models/floorModel");
const mongoose = require("mongoose");

const calculateRoomReservationPrice = (checkInDate, checkOutDate) => {
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day

  // Calculate the number of days between check-in and check-out dates
  const numberOfDays = Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));

  const basePricePerDay = 50; // $50 per day
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

exports.addToCart = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const cartOwner = await User.findOne({ _id: req.user._id });
    if (!cartOwner) {
      return res.status(404).json({ message: "A cart should have an owner" });
    }

    let cart = await Cart.findOne({ cartOwner: cartOwner._id }).session(session);
    if (!cart) {
      cart = await Cart.create({
        cartOwner: cartOwner._id
      }, { session: session });
    }

    if (req.body.product) {
      // Handling medicine purchase
      const product = await Product.findOne({ _id: req.body.product });
      if (!product) {
        return res.status(404).json({ message: "Product Not Found" });
      }

      const productPrice = product.productPrice;
      const productQuantity = req.body.productQuantity;

      if (productQuantity > product.productQuantity) {
        return res.status(409).json({ message: "Sorry, we don't have the requested quantity" });
      }

      const price = productPrice * productQuantity;
      product.productQuantity -= productQuantity;

      cart.products.push(req.body.product);
      cart.totalPrice += price;

      await product.save({ session: session });
    } else if (req.body.checkInDate && req.body.checkOutDate && req.body.room) {
      // Handling room reservation
      const availableRooms = await getAvailableRooms(req.body.checkInDate, req.body.checkOutDate);
      if (availableRooms <= 0) {
        return res.status(409).json({ message: "Sorry, no rooms are available for the selected dates" });
      }

      const roomReservationPrice = calculateRoomReservationPrice(req.body.checkInDate, req.body.checkOutDate);

      const newReservation = new RoomReservation({
        user: req.user._id,
        roomId: req.body.room,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        Price: roomReservationPrice,
        status: 'pending',
      });

      cart.totalPrice += roomReservationPrice;

      cart.roomReservation.push(newReservation._id);

      await newReservation.save({ session: session });
    } else {
      return res.status(400).json({ message: 'Invalid request' });
    }

    await cart.save({ session: session });
    await session.commitTransaction(); // Commit the transaction

    return res.status(200).json({ message: 'Item added to the cart successfully.' });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

exports.getCartContent = async (req, res) => {
  try {
    const cart = await Cart.findOne({ cartOwner: req.user._id })
      .populate('products');  // Populate the product details

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    return res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const Cart = require("../models/MedSellingModels/cartModel.js");
const User = require("../models/userModel.js");
const Product = require("../models/MedSellingModels/productModel.js");
const RoomReservation = require("../models/roomReservationModel");
const floor = require("../models/floorModel");

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

    const allFloors = await floor.find({});

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

    const cart = await Cart.findOne({ cartOwner: cartOwner._id }).session(session);;
    if (!cart) {
      const newCart = await Cart.create({
        cartOwner: cartOwner._id,
        totalPrice: 0,
      },
        { session: session }
      );
      await cartOwner.save({ session: session });

    }

    if (req.body.product) {
      // Handling medicine purchase
      const product = await Product.findOne({ _id: req.body.product });
      if (!product) {
        return res.status(404).json({ message: "Product Not Found" });
      }
      let productPrice = product.productPrice;
      let productQuantity = req.body.productQuantity;

      if (productQuantity > product.productQuantity) {
        return res.status(409).json({ message: "Sorry, we don't have the requested quantity" });
      }

      let price = productPrice * productQuantity;
      product.productQuantity = product.productQuantity - productQuantity;


      newCart.products.push([req.body.product]);
      newCart.totalPrice = newCart.totalPrice + price;
      await product.save({ session: session });
      await newCart.save({ session: session });

      return res.status(200).json({ newCart });

    } if (//req.body.roomType &&
      req.body.checkInDate && req.body.checkOutDate) {

      // Handling room reservation
      const availableRooms = await getAvailableRooms(req.body.checkInDate, req.body.checkOutDate);
      if (availableRooms <= 0) {
        return res.status(409).json({ message: "Sorry, no rooms are available for the selected dates" });
      }

      // Calculate the total price for the room reservation based on the room type and duration
      // You need to implement this calculation logic based on your business rules
      let roomReservationPrice = calculateRoomReservationPrice(req.body.checkInDate, req.body.checkOutDate);

      const newReservation = new RoomReservation({
        user: req.user._id,
        roomId: req.body.room,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        Price: roomReservationPrice,
        status: 'pending',
      });

      // Update the cart's total price
      cart.totalPrice += roomReservationPrice;

      cart.roomReservation.push(newReservation._id);
      // Decrease the available room count for the reserved room type
      const roomReservation = await RoomReservation.findById(cart.roomReservation);
      if (roomReservation) {
        await decreaseAvailableRooms(roomReservation.checkInDate, roomReservation.checkOutDate);
      }

      await newReservation.save({ session: session });
      await cart.save({ session: session });
      await session.commitTransaction(); // Commit the transaction

      return res.status(200).json({ message: 'Room reservation added to cart. Please complete your payment to confirm the reservation.' });

    } else {
      return res.status(400).json({ message: 'Invalid request' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};
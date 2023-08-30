const Cart = require("../models/MedSellingModels/cartModel.js");
const User = require("../models/userModel.js");
const Product = require("../models/MedSellingModels/productModel.js");
const RoomReservation = require("../models/roomReservationModel");
const rooms = require("../models/roomModel");

const getAvailableRooms = async (checkInDate, checkOutDate) => {
  try {
    const reservedRooms = await RoomReservation.find({
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
      status: { $in: ['pending', 'reserved', 'checked-in'] },
    });

    const totalRooms = await rooms.find({ totalQuantity })

    const availableRooms = totalRooms - reservedRooms.length;
    return availableRooms;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.addToCart = async (req, res) => {
  try {
    const cartOwner = await User.findOne({ _id: req.user._id });
    if (!cartOwner) {
      return res.status(404).json({ message: "A cart should have an owner" });
    }

    const cart = await Cart.findOne({ cartOwner: cartOwner._id });

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
      await product.save();

      if (!cart) {
        const newCart = await Cart.create({
          cartOwner: cartOwner._id,
          products: [req.body.product],
          totalPrice: price,
        });
        return res.status(200).json(newCart);
      }
      cart.products.push(req.body.product);
      cart.totalPrice = cart.totalPrice + price;
      await cart.save();

      return res.status(200).json({ cart });
    } else if (req.body.roomType && req.body.checkInDate && req.body.checkOutDate) {

      // Handling room reservation
      const availableRooms = await getAvailableRooms(req.body.checkInDate, req.body.checkOutDate);
      if (availableRooms <= 0) {
        return res.status(409).json({ message: "Sorry, no rooms are available for the selected dates" });
      }
      const newReservation = new RoomReservation({
        user: req.user._id,
        room: req.body.room,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        status: 'pending',
      });

      cart.roomReservation.push(newReservation._id);
      await cart.save();

      //send a frontend message to tell the user to pay in cart to continue the reservation

      return res.status(200).json({ message: 'Room reservation added to cart. Please complete your payment to confirm the reservation.' });

    } else {
      return res.status(400).json({ message: 'Invalid request' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
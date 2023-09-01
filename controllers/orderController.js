const Cart = require("../models/MedSellingModels/cartModel");
const User = require("../models/userModel");
const Order = require("../models/MedSellingModels/orderModel");
const RoomReservation = require("../models/roomReservationModel");

exports.createNewOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.body.cartID });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartOwner = await User.findOne({ _id: req.body.cartOwner });
    if (!cartOwner) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new order with the provided data
    const newOrder = new Order({
      orderOwner: cartOwner._id,
      items: cart.products,
      status: "pending",
    });

    if (cart.roomReservation) {
      // If cart has room reservations, add their ObjectIds to the order
      newOrder.roomReservation = cart.roomReservation.map(reservation => reservation._id);

      // Update the status of the room reservations to 'reserved'
      await RoomReservation.updateMany(
        { _id: { $in: cart.roomReservation }, status: 'pending' },
        { $set: { status: 'reserved' } }
      );
    }

    // Save the new order to the database
    await newOrder.save();

    // Reset cart data
    cart.products = [];
    cart.roomReservation = null; // Reset room reservation in cart
    cart.totalPrice = 0.0;
    await cart.save();

    res.status(200).json({ message: "Order created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.user._id });
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    // Authorization: Only doctors can update order status
    if (admin.role !== "doctor") {
      return res.status(400).json({ message: "Order status can only be updated by a doctor" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the current status is "pending" before updating to "delivered"
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order status cannot be updated. It's not pending." });
    }

    order.status = "delivered";
    await order.save();

    res.status(200).json({ message: "Order status updated to delivered" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating order status" });
  }
};
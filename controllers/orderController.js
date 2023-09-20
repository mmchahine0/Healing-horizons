const Cart = require("../models/MedSellingModels/cartModel");
const User = require("../models/userModel");
const Order = require("../models/MedSellingModels/orderModel");
const RoomReservation = require("../models/roomReservationModel");

exports.createNewOrder = async (req, res) => {
  try {
    const { cartID, cartOwner, totalPrice } = req.body;

    if (typeof totalPrice !== 'number' || totalPrice < 0) {
      return res.status(400).json({ message: 'Invalid totalPrice' });
    }

    const cart = await Cart.findOne({ _id: cartID });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the cart is empty
    if (cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Add items to the cart before creating an order.' });
    }

    const cartOwnerUser = await User.findOne({ _id: cartOwner });
    if (!cartOwnerUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newOrder = new Order({
      orderOwner: cartOwnerUser._id,
      items: cart.products,
      totalPrice: totalPrice,
      status: 'pending',
    });

    if (cart.roomReservation) {
      newOrder.roomReservation = cart.roomReservation.map((reservation) => reservation._id);

      await RoomReservation.updateMany(
        { _id: { $in: cart.roomReservation }, status: 'pending' },
        { $set: { status: 'reserved' } }
      );
    }

    await newOrder.save();

    // Reset cart data
    cart.products = [];
    cart.roomReservation = null;
    cart.totalPrice = 0.0;
    await cart.save();

    res.status(200).json({ message: 'Order created' });
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
    if (order.orderStatus !== "pending") {
      return res.status(400).json({ message: "Order status cannot be updated. It's not pending." });
    }

    order.orderStatus = "delivered";
    await order.save();

    res.status(200).json({ message: "Order status updated to delivered" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating order status" });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ orderOwner: userId });

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving orders for the user" });
  }
};
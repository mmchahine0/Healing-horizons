const Cart = require("../models/MedSellingModels/cartModel");
const User = require("../models/userModel");
const Order = require("../models/MedSellingModels/orderModel");

exports.createNewOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.body.cartID })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }
    const cartOwner = await User.findOne({ _id: req.body.cartOwner })
    if (!cartOwner) {
      return res.status(404).json({ message: "User not found" })
    }
    const newOrder = new Order({
      orderOwner: cartOwner._id,
      items: cart.products,
      status: "pending" // cancel , delivered todo
    })
    await newOrder.save();
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: "Order created" })
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
exports.updateOrderStatus = async (req, res) => {
  try {

    const admin = await User.findOne(req.user._id)
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);
    //Authorasation
    if (admin.role != "doctor") {
      return res.status(400).json({ message: "Order status cannot be updated by a User" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the current status is "pending"
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
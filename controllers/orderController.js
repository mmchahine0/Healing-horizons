const Cart = require("../models/MedSellingModels/cartModel");
const User = require("../models/userModel");
const Order = require("../models/MedSellingModels/orderModel");
const RoomReservation = require("../models/roomReservationModel"); // Import your room reservation model
const rooms = require("../models/roomModel");

const decreaseAvailableRooms = async (checkInDate, checkOutDate) => {
  try {
    const reservedRooms = await RoomReservation.find({
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
      status: { $in: ['pending', 'reserved', 'checked-in'] },
    });

    const totalRooms = await rooms.find({ totalQuantity })

    const availableRooms = totalRooms - reservedRooms.length;
    if (availableRooms > 0) {
      // Update the available room count in your room data
      await rooms.findOneAndUpdate(
        { availableRooms: availableRooms },
        { new: true }
      );
    } else {
      // Handle the case when there are no available rooms
      throw new Error('No available rooms for the specified dates');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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

    const newOrder = new Order({
      orderOwner: cartOwner._id,
      items: cart.products,
      status: "pending", // cancel, delivered todo
    });

    if (cart.roomReservation) {
      // If cart has a room reservation, add it to the order
      newOrder.roomReservation = cart.roomReservation;
      await RoomReservation.updateOne(
        { _id: cart.roomReservation, status: 'pending' },
        { $set: { status: 'reserved' } }
      );
      // Decrease the available room count for the reserved room type
      const roomReservation = await RoomReservation.findById(cart.roomReservation);
      if (roomReservation) {
        await decreaseAvailableRooms(roomReservation.checkInDate, roomReservation.checkOutDate);
      }
    }


    await newOrder.save();
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
    const admin = await User.findOne({ _id: req.user._id }); // Fixed missing curly braces
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

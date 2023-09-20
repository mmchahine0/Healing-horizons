const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    orderOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    roomReservation: [{ type: Schema.Types.ObjectId, ref: 'RoomReservation' }],

    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "delivered"],
    },
    totalPrice: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);

const { Schemas } = require('aws-sdk');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    Price: {
      type: Schema.Types.Decimal128,
      default: 0.0,
      required: [true, "Add the product price"],
    },
    status: {
      type: String,
      enum: ['pending', 'reserved', 'checked-in', 'checked-out', 'canceled'],
      default: 'pending',
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model('RoomReservation', roomReservationSchema);
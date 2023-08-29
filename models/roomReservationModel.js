const mongoose = require('mongoose');

const roomReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomType: {
      type: String,
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
    status: {
      type: String,
      enum: ['reserved', 'checked-in', 'checked-out', 'canceled'],
      default: 'reserved',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoomReservation', roomReservationSchema);
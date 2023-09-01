const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // roomType: {
    //   type: String,
    //   required: true,
    // },
    status: {
      type: String,
      enum: ['available', 'booked', 'occupied'],
      default: 'available',
    },
    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Floor',
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
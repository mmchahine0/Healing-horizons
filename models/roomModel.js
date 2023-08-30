const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomType: {
      type: String,
      required: true,
      //enum: ['normal', 'vip'],//to be added
      default: 'normal',
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 24,
    },
    availableQuantity: {
      type: Number,
      required: true,
      default: 24,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Room', roomSchema);
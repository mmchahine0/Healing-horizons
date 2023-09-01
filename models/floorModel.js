const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema(
  {
    floorNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],

    totalQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    availableQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const updateQuantities = async function (next) {
  try {
    const roomIdArray = this.rooms;
    if (roomIdArray && roomIdArray.length > 0) {
      const roomCount = roomIdArray.length;
      const availableRooms = roomIdArray.filter((roomId) => roomId !== null);

      this.totalQuantity = roomCount;
      this.availableQuantity = availableRooms.length;
    } else {
      this.totalQuantity = 0;
      this.availableQuantity = 0;
    }
  } catch (error) {
    return next(error);
  }
  return next();
};

floorSchema.pre('save', updateQuantities);
floorSchema.pre('remove', updateQuantities);

module.exports = mongoose.model('Floor', floorSchema);
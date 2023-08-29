const mongoose = require('mongoose');

const medicineReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medication: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvalDate: {
      type: Date,
    },
    additionalInfo: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicineReservation', medicineReservationSchema);
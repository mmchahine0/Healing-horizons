const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
    expireAt: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true }
);

appointmentSchema.pre('save', function (next) {
  // Calculate the expiration time as the date plus one day
  const expirationTime = new Date(this.date);
  expirationTime.setDate(expirationTime.getDate() + 1);

  this.expireAt = expirationTime;
  next();
});

appointmentSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Appointment', appointmentSchema);

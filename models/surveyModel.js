const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    allergies: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
      required: true,
    },
    criticalConditions: {
      type: String,
    },
    dateofbirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Survey', surveySchema);

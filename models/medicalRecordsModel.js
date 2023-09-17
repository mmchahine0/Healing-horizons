const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medications: {
      type: String,

    },
    labReports: {
      type: String,
    },
    prescriptions: {
      type: String,

    },
    additionalNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
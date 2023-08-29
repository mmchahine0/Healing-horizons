const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    diagnosis: {
      type: String,
      required: true,
    },
    medications: [{
      name: String,
      dosage: String,
    }],
    labReports: [{
      type: String,
    }],
    prescriptions: [{
      medication: String,
      dosage: String,
      instructions: String,
    }],
    additionalNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
const MedicalRecord = require('../models/medicalRecordsModel.js');
const User = require('../models/userModel.js');

exports.createMedicalRecord = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id);
    const patient = await User.findById(req.body.patientId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.role !== 'doctor') {
      return res.status(400).json({ message: "Only doctors can perform this action" });
    }

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { diagnosis, medications, labReports, prescriptions, additionalNotes } = req.body;

    let medicalRecord = await MedicalRecord.findOne({ patient: patient._id });

    if (medicalRecord) {
      // Update existing medical record
      medicalRecord.user = patient
      medicalRecord.diagnosis = diagnosis;
      medicalRecord.medications = medications;
      medicalRecord.labReports = labReports;
      medicalRecord.prescriptions = prescriptions;
      medicalRecord.additionalNotes = additionalNotes;
    } else {
      // Create a new medical record
      medicalRecord = new MedicalRecord({
        user: patient,
        diagnosis,
        medications,
        labReports,
        prescriptions,
        additionalNotes,
      });

      patient.medicalRecords.push(medicalRecord);
    }

    await Promise.all([medicalRecord.save(), patient.save()]);

    return res.status(201).json({ message: "Medical record created/updated successfully", data: medicalRecord });
  } catch (error) {
    console.error("Error creating/updating medical record:", error.message);
    return res.status(500).json({ message: "Something went wrong during the medical record creation/update process. Please try again later." });
  }
};

exports.getSpecificUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find medical records associated with the user
    const medicalRecords = await MedicalRecord.find({ user: userId });

    return res.status(200).json({ medicalRecords });
  } catch (error) {
    console.error("Error fetching medical records for the user:", error.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

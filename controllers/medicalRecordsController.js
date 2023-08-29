const MedicalRecord = require('../models/medicalRecordsModel.js');
const User = require('../models/userModel.js');

exports.createMedicalRecord = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { diagnosis, medications, labReports, prescriptions, additionalNotes } = req.body;


    const medicalRecord = await MedicalRecord.create({
      patient: patientId,
      diagnosis,
      medications,
      labReports,
      prescriptions,
      additionalNotes,
    });

    return res.status(201).json({ message: "Medical record created successfully", data: medicalRecord });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the medical record creation process, Please try again later." });
  }
};
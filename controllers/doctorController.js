const User = require('../models/userModel');

exports.updateOfficeHours = async (req, res) => {
  try {
    const doctorId = req.user._id;

    // Find the doctor
    const doctor = await User.findById(doctorId);
    //only doctors can change their office hours
    if (doctor.role == "user") return res.status(400).json({ message: "You can't access this feature" });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update the office hours
    doctor.officeHours = req.body.officeHours; //array

    await doctor.save();

    return res.status(200).json({ message: 'Office hours updated successfully', data: doctor });
  } catch (error) {
    console.error('Error updating office hours:', error);
    return res.status(500).json({ message: 'Error updating office hours' });
  }
};
exports.fillBio = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const doctor = await User.findById(doctorId);
    if (doctor.role !== "doctor") return res.status(400).json({ message: "You can't access this feature" });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    doctor.bio = req.body.bio;
    await doctor.save();

    return res.status(200).json({ message: 'Bio updated successfully', bio: doctor.bio });

  } catch (err) {
    console.error('Error insering your bio: ', err);
    return res.status(500).json({ message: 'Error insering your bio ' });
  }
}

exports.chooseSpecialty = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const doctor = await User.findOne({ user: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { specialty } = req.body;

    if (!specialty || !User.schema.path("specialty").enumValues.includes(specialty)) {
      return res.status(400).json({ message: "Invalid specialty" });
    }
    //Make sure to appear all the enum content on front end so he can choose
    doctor.specialty = specialty;
    await doctor.save();

    return res.status(200).json({ message: "Specialty updated successfully" });
  } catch (err) {
    console.error("Error updating specialty: ", err);
    return res.status(500).json({ message: "Error updating specialty" });
  }
}; 
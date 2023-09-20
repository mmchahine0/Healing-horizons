const User = require('../models/userModel');

exports.updateOfficeHours = async (req, res) => {
  try {
    const doctorId = req.user._id;

    // Find the doctor
    const doctor = await User.findById(doctorId);

    if (doctor.role === 'user') {
      return res.status(400).json({ message: "You can't access this feature" });
    }

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newOfficeHours = req.body.officeHours;

    const validOfficeHours = newOfficeHours.every(({ day, startTime, endTime }) => (
      ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(day) &&
      typeof startTime === 'string' &&
      typeof endTime === 'string'
    ));

    if (!validOfficeHours) {
      return res.status(400).json({ message: 'Invalid office hours format' });
    }

    doctor.officeHours = newOfficeHours;
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

exports.getSpeciality = async (req, res) => {
  try {
    const receivedSpecialty = req.params.specialty;

    const doctorsWithSpecialty = await User.find({ specialty: receivedSpecialty });

    if (!doctorsWithSpecialty || doctorsWithSpecialty.length === 0) {
      return res.status(404).json({ message: 'No doctors found with the specified specialty' });
    }

    return res.status(200).json({
      message: 'Doctors with specified specialty found',
      data: doctorsWithSpecialty,
    });
  } catch (err) {
    console.error('Error fetching doctors with specialty: ', err);
    return res.status(500).json({ message: 'Error fetching doctors with specialty' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ message: 'Error fetching doctors' });
  }
};

exports.getADoctor = async (req, res) => {
  const userId = req.params.userId;

  try {
    const doctor = await User.findById(userId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'User is not a doctor' });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return res.status(500).json({ message: 'Error fetching doctor' });
  }
};

exports.getOfficeHours = async (req, res) => {
  const userId = req.params.userId;
  try {
    const doctor = await User.findById(userId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'User is not a doctor' });
    }

    const officeHours = doctor.officeHours;

    return res.status(200).json({ officeHours });
  } catch (error) {
    console.error('Error fetching office hours:', error);
    return res.status(500).json({ message: 'Error fetching office hours' });
  }
};

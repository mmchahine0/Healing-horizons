const MedicineReservation = require('../models/medicineReservationModel');

exports.requestMedication = async (req, res) => {
  try {
    const { medication, quantity, additionalInfo } = req.body;

    const newReservation = new MedicineReservation({
      user: req.user._id,
      medication,
      quantity,
      additionalInfo,
    });

    await newReservation.save();

    res.status(200).json({ message: 'Medication request submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const MedicineReservation = require('../models/medicineReservationModel');

exports.requestMedication = async (req, res) => {
  try {
    const { medication, quantity, additionalInfo } = req.body;

    // Check if the requested quantity is available
    const requestedMedication = await Medicine.findOne({ _id: medication });
    if (!requestedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    if (quantity > requestedMedication.quantity) {
      return res.status(409).json({ message: 'Requested quantity is not available' });
    }

    // Create a new medicine reservation
    const newReservation = new MedicineReservation({
      user: req.user._id,
      medication,
      quantity,
      additionalInfo,
    });

    // Decrease the available quantity of the medication
    requestedMedication.quantity -= quantity;
    await requestedMedication.save();

    await newReservation.save();

    res.status(200).json({ message: 'Medication request submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
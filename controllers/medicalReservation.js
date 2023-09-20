const MedicineReservation = require('../models/medicineReservationModel');
const User = require('../models/userModel')
const Product = require('../models/MedSellingModels/productModel');

exports.requestMedication = async (req, res) => {
  try {
    const { medication, quantity } = req.body;

    const checkUser = await User.findById(req.user.id);

    if (!checkUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requestedMed = await Product.findById(medication);

    if (!requestedMed) {
      return res.status(404).json({ message: 'Medicine not found' });
    }


    const newReservation = new MedicineReservation({
      user: checkUser,
      medication: requestedMed.productName,
      id: medication,
      quantity,
    });

    await newReservation.save();

    return res.status(200).json({ message: 'Medication request submitted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getAllRequestsForDoctor = async (req, res) => {
  try {

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Only doctors can access this endpoint.' });
    }

    const requests = await MedicineReservation.find();

    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
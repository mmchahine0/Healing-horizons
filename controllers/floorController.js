const floor = require("../models/floorModel")
const User = require("../models/userModel");

const checkDoctor = async (req) => {
  try {
    const checkUser = await User.findById(req.user._id)//or_id:req.user._id//https://www.youtube.com/watch?v=yVi4RUL-rpE&t=2s ***/4:00
    if (!checkUser) {
      console.log("User not found")
      return false;
    }
    if (checkUser.role !== "doctor" && checkUser.role !== "admin") {
      console.log("User not authorized to perform the action");
      return false;
    }
    return true;
  } catch (err) {
    console.log(err)
    throw err
  }
};

exports.createFloor = async (req, res) => {
  try {

    const checkUser = await checkDoctor(req);

    if (checkUser == false) {
      return res.status(401).json({ message: "User cannot insert an item" })
    }

    const { floorNumber } = req.body;

    // Check if a floor with the same number already exists
    const existingFloor = await floor.findOne({ floorNumber });

    if (existingFloor) {
      return res.status(400).json({ message: "Floor number already exists" });
    }

    const newFloor = new floor({
      floorNumber
    });

    await newFloor.save();

    res.status(201).json({ message: 'Floor created successfully', floor: newFloor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.getFloorData = async (req, res) => {
  try {
    const checkUser = await checkDoctor(req);

    if (checkUser == false) {
      return res.status(401).json({ message: "User cannot insert an item" })
    }

    const { floorNumber } = req.params;

    const selectedFloor = await floor.findOne({ floorNumber });

    if (!selectedFloor) {
      return res.status(404).json({ message: 'Floor not found' });
    }

    res.status(200).json({ message: 'Floor data retrieved successfully', selectedFloor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
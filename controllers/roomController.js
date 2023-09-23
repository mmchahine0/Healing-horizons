const room = require('../models/roomModel');
const User = require('../models/userModel');
const floor = require('../models/floorModel');

const checkDoctor = async (req) => {
  try {
    const checkUser = await User.findById(req.user._id)
    if (!checkUser) {
      console.log("User not found")
      return false;
    }

    console.log("User role:", checkUser.role);

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


exports.createRoom = async (req, res) => {
  try {

    const checkUser = await checkDoctor(req);

    if (checkUser == false) {
      return res.status(401).json({ message: "User cannot insert an item" })
    }

    const { roomNumber, floorId } = req.body;

    const existingRoom = await room.findOne({ roomNumber });

    if (existingRoom) {
      return res.status(400).json({ message: "Room number already exists" });
    }
    const newRoom = new room({
      roomNumber,
      // roomType,
      floorId
    });

    const foundFloor = await floor.findById(floorId);

    if (!foundFloor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    foundFloor.rooms.push(newRoom._id);

    await newRoom.save();
    await foundFloor.save();

    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getRoom = async (req, res) => {
  try {

    const checkUser = await checkDoctor(req);

    if (checkUser == false) {
      return res.status(401).json({ message: "User cannot insert an item" })
    }

    const { roomId } = req.params;

    const selectedRoom = await room.findById(roomId)

    if (!selectedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room data retrieved successfully', selectedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

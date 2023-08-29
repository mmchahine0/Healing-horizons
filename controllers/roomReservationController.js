const RoomReservation = require('../models/roomReservationModel');

exports.reserveRoom = async (req, res) => {
  try {
    const { roomType, checkInDate, checkOutDate } = req.body;

    const newReservation = new RoomReservation({
      user: req.user._id,
      roomType,
      checkInDate,
      checkOutDate,
    });

    await newReservation.save();

    res.status(200).json({ message: 'Room reservation submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getRoomReservations = async (req, res) => {
  try {
    const userReservations = await RoomReservation.find({ user: req.user._id });
    res.status(200).json(userReservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const cron = require('node-cron');
const Appointment = require('../models/appointmentModel.js');
const sendAppointmentReminder = require('../controllers/appointmentController.js').sendAppointmentReminder;
const User = require('../models/userModel.js');
const moment = require('moment');
const RoomReservation = require('../models/roomReservationModel.js');
const rooms = require('../models/roomModel.js');
const Floor = require('../models/floorModel.js');



cron.schedule('0 9 * * *', async () => {//run at 9 Am everyday
  try {
    const now = moment();

    // Retrieve upcoming appointments 
    const upcomingAppointments = await Appointment.find({
      date: { $gt: now, $lt: now.clone().add(1, 'days') } //within the next 24 hours
    });

    // Loop through upcoming appointments and send reminders
    for (const appointment of upcomingAppointments) {
      const user = await User.findById(appointment.user);

      if (user.role === 'user') {
        // This is a patient, send the reminder to the patient
        await sendAppointmentReminder(user._id, appointment._id);
        // } else if (user.role === 'doctor') {
        //   // This is a doctor, send the reminder to the doctor
        //   // Assuming you have a doctor's email field in your User model
        //   await sendAppointmentReminder(user._id, appointment._id);
        // }
      }
    }

    console.log('Appointment reminder emails sent');
  } catch (error) {
    console.error('Error sending appointment reminder emails:', error);
  }
});

cron.schedule('0 9 * * *', async () => {
  try {
    const now = moment();

    // Find and delete appointments that have passed their date
    await Appointment.deleteMany({ date: { $lt: now } });

    console.log('Deleted past appointments');
  } catch (error) {
    console.error('Error deleting past appointments:', error);
  }
});

/////////ttl index/////////

const updateCheckedOutRooms = async () => {
  try {
    const currentDate = moment(); // Use moment for the current date and time
    const checkedOutReservations = await RoomReservation.find({
      checkOutDate: { $lte: currentDate.toDate() }, // Convert moment to JavaScript Date
      status: 'reserved'
    });

    for (const reservation of checkedOutReservations) {
      reservation.status = 'checked-out';
      await reservation.save();

      // Call the function to increase available rooms
      await increaseAvailableRooms(reservation.roomId);

      console.log(`Room for ${reservation.roomType} is now available.`);
    }

    console.log('Checked-out rooms updated successfully.');
  } catch (error) {
    console.error('Error updating checked-out rooms:', error);
  }
};

const increaseAvailableRooms = async (roomId) => {
  try {
    // Find the floor that contains the room
    const floor = await Floor.findOne({ rooms: roomId });

    if (floor) {
      // Decrease available rooms for the specific floor
      floor.availableQuantity += 1; // Assuming 1 room is now available
      await floor.save();
    } else {
      console.log(`Floor not found for room with ID ${roomId}.`);
    }
  } catch (error) {
    console.error('Error increasing available rooms:', error);
  }
};

cron.schedule('0 9 * * *', updateCheckedOutRooms);

module.exports = updateCheckedOutRooms;





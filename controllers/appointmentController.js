const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');
const sendMail = require('../utils/email.js');
const moment = require('moment');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;
    const patientId = req.user._id;


    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);


    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    // Check if the appointment date is valid
    if (!moment(appointmentDate).isValid()) {
      return res.status(400).json({ message: "Invalid appointment date format" });
    }

    // Check doctor's availability
    const existingAppointment = await Appointment.findOne({ doctor: doctorId, appointmentDate });

    if (existingAppointment) {
      return res.status(409).json({ message: "Appointment slot already booked" });
    }

    // Check doctor's office hours for availability
    const dayOfWeek = moment(appointmentDate).format('ddd').toLowerCase();
    const selectedTime = moment(appointmentDate).format('HH:mm');

    let isAvailable = false;

    for (const officeHour of doctor.officeHours) {
      if (
        officeHour.day === dayOfWeek &&
        moment(selectedTime, 'HH:mm').isBetween(
          moment(officeHour.startTime, 'HH:mm'),
          moment(officeHour.endTime, 'HH:mm'),
          null,  // Add 'null' as the fourth argument to make the comparison inclusive
          '[]'
        )
      ) {
        isAvailable = true;
        break; // Exit the loop
      }
    }

    if (!isAvailable) {
      return res.status(400).json({ message: `Dr. ${doctor.fullname} is not available at the selected time. Please check doctor office hour at Dr. ${doctor.fullname}'s Profile` });
    }
    const selectedAppointmentTime = moment(appointmentDate);

    const existingAppointmentWithin1Hour = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: {
        $gte: selectedAppointmentTime.clone().subtract(1, 'hour').toDate(),
        $lt: selectedAppointmentTime.clone().add(1, 'hour').toDate(),
      },
    });

    if (existingAppointmentWithin1Hour) {
      return res.status(400).json({ message: 'Another appointment is already booked within the next 1 hour.' });
    }

    const appointmentData = {
      time: selectedTime,
      date: moment(appointmentDate).format('YYYY-MM-DD'),
      user: patientId,
    };

    const appointment = await Appointment.create(appointmentData);

    return res.status(201).json({ message: "Appointment booked successfully", data: appointment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the booking process, Please try again later." });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId;
    const patientId = req.user._id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }


    // Check if the patient is authorized to cancel the appointment
    if (!appointment.user._id.equals(patientId)) {
      return res.status(403).json({ message: "Unauthorized to cancel this appointment" });
    }

    // Remove the appointment
    await appointment.deleteOne();

    return res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the cancellation process, Please try again later." });
  }
};

exports.sendAppointmentReminder = async (req, res) => {
  try {
    const { userId, appointmentId, doctorId } = req.body;

    const user = await User.findById(userId);
    const doctor = await User.findById(doctorId);
    const appointment = await Appointment.findById(appointmentId);

    const userEmail = user.email;

    const emailOptions = {
      email: userEmail,
      subject: 'Your Appointment Reminder',
      message: `Dear ${user.fullname},\n\nThis is a reminder for your upcoming appointment with Dr. ${doctor.fullname}.\n\nDate: ${appointment.date}\nTime: ${appointment.time}\n\nPlease make sure to attend on time.\n\nBest regards,\nThe HealingHorizons Team`,
    };

    await sendMail(emailOptions);

    return res.status(200).json({ message: 'Appointment reminder email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending appointment reminder email' });
  }
};

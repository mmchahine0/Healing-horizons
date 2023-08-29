// const Notification = require('../models/notificationModel.js');

// exports.sendNotification = async (req, res) => {
//   try {
//     const { userId, message } = req.body;

//     const newNotification = await Notification.create({
//       user: userId,
//       message,
//     });

//     return res.status(201).json({ message: "Notification sent successfully", data: newNotification });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Something went wrong while sending the notification" });
//   }
// };
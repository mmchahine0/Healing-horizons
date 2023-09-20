const User = require('../models/userModel.js');
const sendMail = require('../utils/email').sendMail;

exports.sendEmail = async (req, res) => {
  try {
    const { receiver, subject, message } = req.body;
    const senderId = req.user._id;


    const sender = await User.findById(senderId);
    console.log(sender)
    console.log(receiver)

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }
    if (!subject || !message) return res.status(404).json({ message: "You can't send an email with empty credentials" });


    const emailOptions = {
      from: sender.email,
      email: receiver,
      subject: subject,
      message: message,
    };


    await sendMail(emailOptions);

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong while sending the email, Please try again later." });
  }
};
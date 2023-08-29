const nodemailer = require('nodemailer');

exports.sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: "HealingHorizons <info@healinghorizons.com>",
    to: options.email,
    subject: options.subject,
    test: options.message
  };

  await transporter.sendMail(mailOptions)
}
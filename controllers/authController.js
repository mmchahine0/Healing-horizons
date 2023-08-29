const User = require('../models/userModel.js');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const sendMail = require("../utils/email").sendMail;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
}
const createToken = (user, statusCode, message, res) => {
  const token = signToken(user._id)
  res.status(statusCode).json({ message: message, status: "success", token });
}

exports.generateCronToken = async (req, res) => {
  try {
    const cronToken = signToken('cron', { expiresIn: process.env.CRON_JWT_EXPIRES });
    res.status(200).json({ token: cronToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating cron token' });
  }
};
//finish this , implement api
exports.signup = async (req, res) => {
  try {
    const userCheck = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ message: "Invalid email" })
    }

    if (userCheck) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }
    const newUser = await User.create({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    return createToken(newUser, 201, `Dear ${req.body.fullname} your account was created successfully! `, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the sign up process, Please try again later." });
  }
}

exports.login = async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (!(validator.isEmail(req.body.email))) {
      return res.status(400).json({ message: "Invalid email" })
    }
    if (!checkUser) {
      return res.status(404).json({ message: "User is not found" });
    }
    if (!(await checkUser.checkPassword(req.body.password, checkUser.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return createToken(checkUser, 200, "Logged in successfully", res)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the log in process, Please try again later." })
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const checkUser = await User.findById(req.params.userId)
    if (!checkUser) {
      return res.status(404).json({ message: "User is not found" });
    }
    if ((req.body.password == req.body.oldPassword)) {
      return res.status(400).json({ message: "You didn't change the password" });
    }
    if (!(await checkUser.checkPassword(req.body.oldPassword, checkUser.password))) {
      return res.status(400).json({ message: "Password incorrect" });
    }
    if (await checkUser.checkPassword(req.body.password, checkUser.password)) {
      return res.status(400).json({ message: "You entered an old password" });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Password don't match" });
    }
    checkUser.password = req.body.password;
    await checkUser.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during updating the proccess, Please try again later." })
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (!checkUser) {
      return res.status(404).json({ message: "User is not found" });
    }
    const resetToken = checkUser.generatePasswordResetToken();

    await checkUser.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get('host')}/auth/resetpassword/${resetToken}`;

    const message = `Forgot your password? Submit a request to reset your password`

    try {
      await sendMail({
        email: checkUser.email,
        subject: "Your password reset token (valid for 10 min)",
        message: message
      })
    } catch (err) {
      checkUser.passwordResetToken = undefined;
      checkUser.passwordResetExpires = undefined;
    }
    return res.status(200).json({ message: "Token sent to email", data: url });
  } catch (err) {
    console.log(err);
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const checkUser = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!checkUser) {
      return res.status(400).json({ message: "User not found" })
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({ message: "password do not match" })
    }
    checkUser.password = req.body.password;
    checkUser.passwordResetToken = undefined;
    checkUser.passwordResetExpires = undefined;
    await checkUser.save();
    createToken(checkUser, 201, "Password reset succesfully", res)
  } catch (err) {
    console.log(err);
  }
}

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "You are not logged in, Please log in to get access" })
    }
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please log in again" });
      }
      else if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Your session were expired. Please log in again"
        })
      }
    }
    const checkUser = await User.findOne(decoded._id)
    if (!checkUser) {
      return res.status(404).json({ message: "The user belonging to this session does no longer exist" })
    }

    if (checkUser.passwordChangedAfterTokenIssued(decoded.iat)) {
      return res.status(401).json({ message: "You recently changed your password. Please log in again" })
    }
    req.user = checkUser;
    next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Something went wrong during the process, Please try again later." })
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length == 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ message: "Users found", data: users });
  } catch (err) {
    console.log(err)
  }
}
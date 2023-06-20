const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SendOTP, VerifyOTP } = require("../config/OTP");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const cloudinary = require("cloudinary").v2;
exports.LoginHandler = asyncHandler(async (req, res, next) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password)
    res.status(404).send({ message: "All Fields Are Required" });
  else {
    await User.findOne({ email, phone })
      .then(async (user) => {
        if (!user) res.status(404).send({ message: "User Not Found" });
        else {
          const matching = await bcrypt.compare(password, user.password);
          if (!matching) {
            res.status(403).send({ message: "Password doesn't match" });
          } else {
            delete user._doc.password && delete user._doc.__v;
            const token = jwt.sign(
              { id: user.id, role: user.role },
              process.env.TOKEN,
              { expiresIn: "30d" }
            );
            res.status(200).json({ ...user.toObject(), token });
          }
        }
      })
      .catch((err) => console.log(`Errors is : ${err}`));
  }
});

exports.RegisterHandler = asyncHandler(async (req, res, next) => {
  const { username, email, phone, password, government, location } = req.body;
  if (!username || !email || !phone || !password || !government || !location)
    res.status(403).send({ message: "All Fields Are Required." });
  await User.findOne({ $or: [{ phone }, { email }] }).then(async (user) => {
    if (user)
      res
        .status(409)
        .send({ message: "User with this email or phone already exists." });
    else {
      await User.create({
        username,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        government,
        location,
        secret: "*".repeat(password.length)
      }).then((user) => {
        delete user._doc.password && delete user._doc.__v;
        res.status(201).json(user);
      });
    }
  });
});

exports.ForgetHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email." });
    } else {
      const findOne = await User.findOne({ email });
      if (!findOne) {
        res.status(403).json({ message: "Email does not exist." });
      } else {
        const OTP = await SendOTP(email);
        if (!OTP) {
          res.status(403).json({ message: "Failed to send the email" });
        } else {
          res.sendStatus(200);
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

exports.OTPCheck = asyncHandler(async (req, res) => {
  const { OTP, email } = req.body;
  if (!email || !OTP)
    res.status(404).json({ message: "All Fields Are Required" });
  else {
    try {
      const validate = await VerifyOTP(OTP, email);
      const user = await User.findOne({ email });
      if (!user) {
        res.status(403).json({ message: "Can't Find Your Email." });
      } else {
        if (!validate) {
          res.status(403).json({ message: "Invalid Otp" });
        } else {
          res.status(200).json({ id: user.id });
        }
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

exports.UpdatePassword = asyncHandler(async (req, res) => {
  const { id, newPassword } = req.body;
  if (!id || !newPassword)
    res.status(403).json({ message: "All Fields Are Required." });
  else {
    try {
      const password = await bcrypt.hash(newPassword, 10);
      const user = await User.findByIdAndUpdate(id, { password }).exec();
      if (!user) {
        res.status(404).json({ message: "User Not Found" });
      } else {
        res.status(200).json({ message: "Password Successfully Updated." });
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
});

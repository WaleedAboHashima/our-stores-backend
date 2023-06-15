const Founder = require("../models/Founder");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwt = require("jsonwebtoken");

exports.FounderLogin = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;
  if (!email || !password || !phone) {
    res.status(403).json({ message: "All fields are required" });
  } else {
    await Founder.findOne({ email, phone }).then(async (founder) => {
      if (!founder) {
        res.status(404).json({ message: "Founder not found." });
      } else {
        const matching = await bcrypt.compare(password, founder.password);
        if (!matching) {
          res.status(403).json({ message: "Password mismatch." });
        } else {
          delete founder._doc.password && delete founder._doc.__v;
          const token = jwt.sign(
            { id: founder.id, role: founder.role },
            process.env.TOKEN,
            { expiresIn: "30d" }
          );
          res.status(200).json({ ...founder.toObject(), token });
        }
      }
    });
  }
});

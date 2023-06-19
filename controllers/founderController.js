const Founder = require("../models/Founder");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwt = require("jsonwebtoken");
const Rules = require("../models/Rules");

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

exports.FounderRegister = async (req, res) => {
  const { email, phone, password } = req.body;
  await Founder.create({
    email,
    phone,
    password: await bcrypt.hash(password, 10),
  });
  res.sendStatus(201);
};

exports.AddRules = asyncHandler(async (req, res, next) => {
  const { type } = req.query;
  if (type === "uses") {
    const { textBody } = req.body;
    if (!textBody)
      return next(new ApiError("Please provide terms of use.", 400));
    await Rules.findOne({ type }).then(async (rule) => {
      if (rule)
        await Rules.findOneAndUpdate({ type }, { textBody }).then((uses) =>
          res.json(uses)
        );
      else
        await Rules.create({ type, textBody }).then((uses) =>
          res.json(uses)
        );
    });
  }
  else if (type === "privacy") {
    const { textBody } = req.body;
    if (!textBody) return next(new ApiError("Please provide privacy.", 400));
    await Rules.findOne({ type }).then(async (rule) => {
      if (rule) await Rules.findOneAndUpdate({ type }, { textBody }).then((privacy) => res.json(privacy));
      else await Rules.create({ type, textBody }).then(privacy => res.json(privacy)); 
    })
  }
  else {
    res.status(404).json({message: "Invalid Rules Type."})
  }
});

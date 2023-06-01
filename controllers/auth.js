const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            res.status(200).json({...user.toObject(), token });
          }
        }
      })
      .catch((err) => console.log(`Errors is : ${err}`));
  }
});

exports.RegisterHandler = asyncHandler(async (req, res, next) => {
  const { username, email, phone, password, location } = req.body;
  if (!username || !email || !phone || !password || !location)
    res.status(404).send({ message: "All Fields Are Required." });
  await User.findOne({ phone , email }).then(async (user) => {
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
        location,
      }).then((user) => {
        delete user._doc.password && delete user._doc.__v;
        res.status(201).json(user);
      });
    }
  });
});

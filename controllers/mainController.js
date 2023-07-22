const Orders = require("../models/Orders");
const asyncHandler = require("express-async-handler");
const Rules = require("../models/Rules");
const User = require("../models/User");
const Reports = require("../models/Report");
exports.GetAllOrders = asyncHandler(async (req, res, next) => {
  try {
    const allorders = await Orders.find({}).populate({
      path: "user",
      select: "-password -__v",
    });
    if (allorders) {
      const orders = allorders.filter((order) => !order.SR);
      res.status(200).json({ orders });
    } else {
      res.status(404).json({ message: "No orders found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

exports.GetRules = asyncHandler(async (req, res, next) => {
  const { type } = req.query;
  await Rules.findOne({ type })
    .then(async (rule) => {
      delete rule._doc.__v &&
        delete rule._doc._id &&
        delete rule._doc.type &&
        delete rule._doc.createdAt;
      const isoDate = new Date(rule._doc.updatedAt).toISOString();
      const [year, month, day] = isoDate.split("T")[0].split("-");
      rule._doc.updatedAt = `${day}/${month}/${year}`;
      res.json(rule);
    })
    .catch((err) => next(new ApiError("Couldn't find rule", 404)));
});

exports.GetProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).json({ message: "User Id Required." });
  } else {
    const foundUser = await User.findOne({ _id: userId });
    if (foundUser) {
      delete foundUser._doc.password &&
        delete foundUser._doc.__v &&
        delete foundUser._doc.role &&
        delete foundUser._doc.active;
      res.status(200).json({ user: foundUser });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  }
});

exports.UpdateUserInfo = asyncHandler(async (req, res, next) => {
  const type = req.query;
  const userId = req.user.id;
  if (type.USERNAME) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { username: type.USERNAME });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.PASSWORD) {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      res.status(403).json({ message: "All fields are required." });
    await User.findById(userId).then(async (user) => {
      if (user) {
        const matching = await bcrypt.compare(oldPassword, user.password);
        if (matching) {
          await User.findByIdAndUpdate(userId, {
            password: await bcrypt.hash(newPassword, 10),
          });
          res.sendStatus(200);
        } else {
          res.status(403).json({ message: "Password doesnt match" });
        }
      }
    });
  } else if (type.EMAIL) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        const duplicate = await User.findOne({ email: type.EMAIL });
        if (duplicate)
          res
            .status(409)
            .json({ message: "A user already exists with this email." });
        else {
          await User.findByIdAndUpdate(userId, { email: type.EMAIL });
          res.sendStatus(200);
        }
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.GOVERNMENT) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { government: type.GOVERNMENT });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.LOCATION) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { location: type.LOCATION });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.PHONE) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        const duplicate = await User.findOne({ phone: type.PHONE });
        if (duplicate) {
          res
            .status(409)
            .json({ message: "A user with this phone already exists." });
        } else {
          await User.findByIdAndUpdate(userId, { phone: type.PHONE });
          res.sendStatus(200);
        }
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else {
    res.status(403).json({ message: "Incorrect Query." });
  }
});

exports.AddFeedback = asyncHandler(async (req, res, next) => {
  const { username, email, message } = req.body;
  if (!username || !email || !message)
    return res.status(403).json({ message: "All fields are required" });
  else {
    await Reports.create({ username, email, message }).then(() =>
      res.sendStatus(201)
    );
  }
});

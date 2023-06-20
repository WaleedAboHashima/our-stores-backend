const asyncHandler = require("express-async-handler");
const Store = require("../models/Stores");
const User = require("../models/User");
const Governments = require("../models/Governments");
const Rules = require("../models/Rules");
const Order = require("../models/Orders");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

exports.GetStores = asyncHandler(async (req, res) => {
  const { government, state } = req.body;
  if (!government || !state) {
    res.status(403).json({ message: "All fields are required." });
  } else {
    try {
      const stores = await Store.find({ government, location: state });
      if (stores) {
        const storesWithoutPassword = stores.map((store) => {
          const { __v, password, ...storesWithoutPassword } = store._doc;
          return storesWithoutPassword;
        });
        res.status(200).json({ Stores: storesWithoutPassword });
      } else {
        res.status(200).json([]);
      }
    } catch (err) {
      res.status(403).json({ message: err });
    }
  }
});

exports.GetNearStores = asyncHandler(async (req, res) => {
  const { id } = req.query;
  const { government, location } = req.body;
  if (!government || !location)
    res.status(403).json({ message: "All fields are required." });
  if (!id) {
    res.status(403).json({ message: "User Id is required." });
  } else {
    try {
      const user = await User.findById({ _id: id });
      if (!user) {
        res.status(404).json({ message: "User does not exist." });
      } else {
        const stores = await Store.find({ location, government });
        if (stores) {
          const storesWithoutPassword = stores.map((store) => {
            const { __v, password, ...storesWithoutPassword } = store._doc;
            return storesWithoutPassword;
          });
          res.status(200).json({ Stores: storesWithoutPassword });
        } else {
          res
            .status(404)
            .json({ message: "No stores found with this location." });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});

exports.GetStates = asyncHandler(async (req, res, next) => {
  const { gove } = req.query;
  const data = await Governments.findOne({ name: gove });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ states: [] });
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

exports.AddOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { name, description, price, totalPrice, quantity } = req.body;
  if (!name || !description || !price || !totalPrice || !quantity) {
    res.status(403).json({ message: "All Fields are required." });
  } else {
    await Order.create({
      name,
      description,
      price,
      totalPrice,
      quantity,
      user: userId,
    }).then((order) => {
      res.status(201).json(order);
    });
  }
});

exports.GetOrderHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).json({ message: "User Id Required." });
  } else {
    const foundUser = await Order.find({ user: userId });
    if (foundUser) {
      const orders = foundUser.map((order) => {
        const { __v, updatedAt, user, ...orders } = order._doc;
        return orders;
      });
      res.status(200).json({ orderDetails: orders });
    } else {
      res.status(404).json({ message: "User Not Found." });
    }
  }
});

exports.UpdateUserInfo = asyncHandler(async (req, res, next) => {
  const type = req.query;
  const userId = req.user.id;
  if (type.username) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { username: type.username });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.password) {
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
  } else if (type.email) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        const duplicate = await User.findOne({ email: type.email });
        if (duplicate)
          res
            .status(409)
            .json({ message: "A user already exists with this email." });
        else {
          await User.findByIdAndUpdate(userId, { email: type.email });
          res.sendStatus(200);
        }
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.government) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { government: type.government });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.location) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { location: type.location });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.phone) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        const duplicate = await User.findOne({ phone: type.phone });
        if (duplicate) {
          res
            .status(409)
            .json({ message: "A user with this phone already exists." });
        } else {
          await User.findByIdAndUpdate(userId, { phone: type.phone });
          res.sendStatus(200);
        }
      } else res.status(404).json({ message: "User Not Found." });
    });
  }
});

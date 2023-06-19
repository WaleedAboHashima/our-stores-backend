const asyncHandler = require("express-async-handler");
const Store = require("../models/Stores");
const User = require("../models/User");
const Governments = require("../models/Governments");
const Rules = require("../models/Rules");
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
  const { userId } = req.params;
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

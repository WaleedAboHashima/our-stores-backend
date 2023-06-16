const asyncHandler = require("express-async-handler");
const Store = require("../models/Stores");
const User = require("../models/User");
const Governments = require("../models/Governments")
exports.GetStores = asyncHandler(async (req, res) => {
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
  const data = await Governments.findOne({ name: gove })
  if (data) {
    res.status(200).json(data);
  }
  else {
    res.status(200).json([])
  }
});

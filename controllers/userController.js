const asyncHandler = require("express-async-handler");
const Store = require("../models/Stores");

exports.GetStores = asyncHandler(async (req, res) => {
  const stores = await Store.find({});
  const storesWithoutPassword = stores.map((store) => {
    const { __v, password, ...storesWithoutPassword } = store._doc;
    return storesWithoutPassword;
  });
  res.json({ Stores: storesWithoutPassword });
});

const mongoose = require("mongoose");

const Store = mongoose.model(
  "Stores",
  new mongoose.Schema(
    {
      email: {
        required: true,
        type: String,
      },
      phone: {
        required: true,
        type: Number,
      },
      password: {
        required: true,
        type: String,
      },
      role: {
        type: String,
        default: "Store",
      },
      storeName: {
        required: true,
        type: String,
      },
      government: {
        required: true,
        type: String,
      },
      location: {
        required: true,
        type: String,
      },
      logo: {
        required: true,
        type: String,
      }
    },
    { collection: "Stores" }
  )
);

module.exports = Store;

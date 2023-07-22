const mongoose = require("mongoose");

const User = mongoose.model(
  "Users",
  new mongoose.Schema(
    {
      username: {
        required: true,
        type: String,
      },
      password: {
        required: true,
        type: String,
      },
      email: {
        required: true,
        type: String,
      },
      phone: {
        required: true,
        type: Number,
      },
      government: {
        required: true,
        type: String,
      },
      location: {
        required: true,
        type: String,
      },
      role: {
        type: String,
        default: "User",
      },
      active: {
        type: Boolean,
        default: false,
      },
      secret: {
        type: String,
        default: "",
      },
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stores",
      },
    },
    { collection: "Users" }
  )
);

module.exports = User;

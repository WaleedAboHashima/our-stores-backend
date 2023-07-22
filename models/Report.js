const mongoose = require("mongoose");

const Report = mongoose.model(
  "Reports",
  new mongoose.Schema(
    {
      username: {
        required: true,
        type: String,
      },
      email: {
        required: true,
        type: String,
      },
      message: {
        required: true,
        type: String,
      },
    },
    { collection: "Reports" }
  )
);

module.exports = Report;

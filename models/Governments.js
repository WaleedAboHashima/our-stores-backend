const mongoose = require("mongoose");

const Government = mongoose.model(
  "Governments",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      states: [{ name: { type: String, required: true } }],
    },
    { collection: "Governments" }
  )
);

module.exports = Government;

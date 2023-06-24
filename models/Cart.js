const mongoose = require("mongoose");

const Cart = mongoose.model(
  "Carts",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      products: {
        type: Array,
        required: true,
      },
    },
    { collection: "Carts" }
  )
);

module.exports = Cart;

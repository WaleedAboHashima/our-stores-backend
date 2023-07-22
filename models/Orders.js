const mongoose = require("mongoose");

const Orders = mongoose.model(
  "Orders",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
      archived: {
        type: "Boolean",
        required: false,
        default: false,
      },
      SR: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      }
    },
    { timestamps: true },
  )
);

module.exports = Orders;

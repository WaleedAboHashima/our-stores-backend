const mongoose = require("mongoose");

const Product = mongoose.model(
  "Products",
  new mongoose.Schema(
    {
      store: { type:  mongoose.Schema.Types.ObjectId, ref: 'Stores' },
      productName: {
        required: [true, "Please Enter The Product Name"],
        type: "String",
      },
      category: {
        required: [true, "Please Enter The Product Category"],
        type: "String",
      },
      price: {
        required: [true, "Please Enter The Product Price"],
        type: "Number",
      },
      quantity: {
        required: [true, "Please Enter The Product Quantity"],
        type: "Number",
      },
      totalPrice: {
        required: [true, "Please Enter The Product Total Price"],
        type: "Number",
      },
      sizes: {
        type: Array,
        default: [],
        required: [true, "Please Enter The Product Size"],
      },
      description: {
        type: "String",
        required: [true, "Please Enter The Product Description"],
      },
      fav: {
        type: "Boolean",
        required: false,
        default: false,
      },
      images: Array,
    },
    { collection: "Products" }
  )
);

module.exports = Product;
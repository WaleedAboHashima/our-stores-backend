const mongoose = require("mongoose");

const Product = mongoose.model(
  "Products",
  new mongoose.Schema(
    {
      name: {
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
      sizes: {
        type: "String",
        default: "",
      },
      description: {
        type: "String",
        required: [true, "Please Enter The Product Description"],
      },
      images: Array,
    },
    { collection: "Products" }
  )
);

module.exports = Product;
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
      productNameAR: {
        required: [true, "Please Enter The Product NameAR"],
        type: "String",
      },
      category: {
        required: [true, "Please Enter The Product Category"],
        type: "String",
      },
      categoryAR: {
        required: [true, "Please Enter The Product CategoryAR"],
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
    {timestamps: true},
  )
);

module.exports = Product;
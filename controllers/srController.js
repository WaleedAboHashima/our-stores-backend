const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Orders = require("../models/Orders");
const Users = require("../models/User");

exports.AddCustomer = asyncHandler(async (req, res, next) => {
  const srId = req.user.id;
  const { orderId } = req.params;
  await Orders.findById(orderId).then(async (order) => {
    if (!order) return res.status(404).json({ message: "Order Not Found." });
    else if (order.SR) {
      if (order.SR._id.toString() !== srId) {
        res.status(409).json({ message: "Order Belongs To Another SR" });
      } else {
        await Orders.updateOne({ _id: orderId }, { $unset: { SR: "" } });
        res.sendStatus(200);
      }
    } else {
      order.SR = srId;
      await order.save();
      res.sendStatus(200);
    }
  });
});

exports.GetMyOrders = asyncHandler(async (req, res, next) => {
  const srId = req.user.id;
  if (!srId) return res.status(400).json({ message: "Sr id required." });
  else {
    const orders = await Orders.find({ SR: srId });
    orders.map((order) => {
      delete order._doc.SR && delete order._doc.__v;
    });
    res.status(200).json({ orders });
  }
});

exports.GetOrderDetail = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  if (!orderId)
    return res.status(403).json({ message: "Order Id is required." });
  else {
    const order = await Orders.findById(orderId).populate({
      path: "user SR",
      select: "-password -secret -__v",
    });
    if (!order) {
      res.status(404).json({ message: "Order Not Found." });
    } else {
      const isoDate = new Date(order._doc.createdAt).toISOString();
      const [year, month, day] = isoDate.split("T")[0].split("-");
      order._doc.createdAt = `${day}-${month}-${year}`;
      delete order._doc.updatedAt;
      res.status(200).json(order);
    }
  }
});

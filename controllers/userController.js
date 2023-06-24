const asyncHandler = require("express-async-handler");
const Store = require("../models/Stores");
const User = require("../models/User");
const Governments = require("../models/Governments");
const Rules = require("../models/Rules");
const Order = require("../models/Orders");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const Product = require("../models/Products");
const Cart = require("../models/Cart");

// Profile

exports.GetStates = asyncHandler(async (req, res, next) => {
  const { gove } = req.query;
  const data = await Governments.findOne({ name: gove });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ states: [] });
  }
});

exports.GetRules = asyncHandler(async (req, res, next) => {
  const { type } = req.query;
  await Rules.findOne({ type })
    .then(async (rule) => {
      delete rule._doc.__v &&
        delete rule._doc._id &&
        delete rule._doc.type &&
        delete rule._doc.createdAt;
      const isoDate = new Date(rule._doc.updatedAt).toISOString();
      const [year, month, day] = isoDate.split("T")[0].split("-");
      rule._doc.updatedAt = `${day}/${month}/${year}`;
      res.json(rule);
    })
    .catch((err) => next(new ApiError("Couldn't find rule", 404)));
});

exports.GetProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).json({ message: "User Id Required." });
  } else {
    const foundUser = await User.findOne({ _id: userId });
    if (foundUser) {
      delete foundUser._doc.password &&
        delete foundUser._doc.__v &&
        delete foundUser._doc.role &&
        delete foundUser._doc.active;
      res.status(200).json({ user: foundUser });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  }
});

exports.UpdateUserInfo = asyncHandler(async (req, res, next) => {
  const type = req.query;
  const userId = req.user.id;
  if (type.USERNAME) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { username: type.USERNAME });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.PASSWORD) {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      res.status(403).json({ message: "All fields are required." });
    await User.findById(userId).then(async (user) => {
      if (user) {
        const matching = await bcrypt.compare(oldPassword, user.password);
        if (matching) {
          await User.findByIdAndUpdate(userId, {
            password: await bcrypt.hash(newPassword, 10),
          });
          res.sendStatus(200);
        } else {
          res.status(403).json({ message: "Password doesnt match" });
        }
      }
    });
  } else if (type.EMAIL) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        const duplicate = await User.findOne({ email: type.EMAIL });
        if (duplicate)
          res
            .status(409)
            .json({ message: "A user already exists with this email." });
        else {
          await User.findByIdAndUpdate(userId, { email: type.EMAIL });
          res.sendStatus(200);
        }
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.GOVERNMENT) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { government: type.GOVERNMENT });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.LOCATION) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        await User.findByIdAndUpdate(userId, { location: type.LOCATION });
        res.sendStatus(200);
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else if (type.PHONE) {
    await User.findById(userId).then(async (user) => {
      if (user) {
        const duplicate = await User.findOne({ phone: type.PHONE });
        if (duplicate) {
          res
            .status(409)
            .json({ message: "A user with this phone already exists." });
        } else {
          await User.findByIdAndUpdate(userId, { phone: type.PHONE });
          res.sendStatus(200);
        }
      } else res.status(404).json({ message: "User Not Found." });
    });
  } else {
    res.status(403).json({ message: "Incorrect Query." });
  }
});

// Orders

exports.AddOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { name, description, price, totalPrice, quantity } = req.body;
  if (!name || !description || !price || !totalPrice || !quantity) {
    res.status(403).json({ message: "All Fields are required." });
  } else {
    await Order.create({
      name,
      description,
      price,
      totalPrice,
      quantity,
      user: userId,
    }).then((order) => {
      res.status(201).json(order);
    });
  }
});

exports.GetOrderHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).json({ message: "User Id Required." });
  } else {
    const foundUser = await Order.find({ user: userId });
    if (foundUser) {
      const orders = foundUser.map((order) => {
        const { __v, updatedAt, user, ...orders } = order._doc;
        return orders;
      });
      res.status(200).json({ orderDetails: orders });
    } else {
      res.status(404).json({ message: "User Not Found." });
    }
  }
});

// Products & Stores

exports.GetStores = asyncHandler(async (req, res) => {
  const { government, state } = req.body;
  if (!government || !state) {
    res.status(403).json({ message: "All fields are required." });
  } else {
    try {
      const stores = await Store.find({ government, location: state });
      if (stores) {
        const storesWithoutPassword = stores.map((store) => {
          const { __v, password, products, ...storesWithoutPassword } =
            store._doc;
          return storesWithoutPassword;
        });
        res.status(200).json({ Stores: storesWithoutPassword });
      } else {
        res.status(200).json([]);
      }
    } catch (err) {
      res.status(403).json({ message: err });
    }
  }
});

exports.GetNearStores = asyncHandler(async (req, res) => {
  const { id } = req.query;
  const { government, location } = req.body;
  if (!government || !location)
    res.status(403).json({ message: "All fields are required." });
  if (!id) {
    res.status(403).json({ message: "User Id is required." });
  } else {
    try {
      const user = await User.findById({ _id: id });
      if (!user) {
        res.status(404).json({ message: "User does not exist." });
      } else {
        const stores = await Store.find({ location, government });
        if (stores) {
          const storesWithoutPassword = stores.map((store) => {
            const { __v, password, ...storesWithoutPassword } = store._doc;
            return storesWithoutPassword;
          });
          res.status(200).json({ Stores: storesWithoutPassword });
        } else {
          res
            .status(404)
            .json({ message: "No stores found with this location." });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});

exports.GetAllStoreProductsAndCategory = asyncHandler(
  async (req, res, next) => {
    const { storeId } = req.params;
    if (!storeId)
      return res.status(403).json({ message: "Store Id Required." });
    else {
      const products = await Product.find({ store: storeId });
      const categories = await Product.distinct("category", { store: storeId });
      if (!products)
        res
          .status(404)
          .json({ message: "There is no store for this product." });
      else {
        res.status(200).json({ products: products, categories: categories });
      }
    }
  }
);

exports.GetProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  if (productId.length === 10)
    res.status(403).json({ message: "Product Id Required." });
  else {
    const product = await Product.findById(productId).populate({
      path: "store",
      select: "-__v -password -products -role",
    });
    if (!product) res.status(404).json({ message: "Product not found." });
    else {
      delete product._doc.__v;
      res.status(200).json({ product });
    }
  }
});

//Carts

exports.AddToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.query;
  const product = await Product.findById(productId);
  if (!product) res.status(404).json({ message: "Product not found." });
  else {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      const newProduct = product;
      newProduct.quantity = 1;
      newProduct.price = product.price;
      newProduct.sizes = [];
      newProduct.description = product.description;
      newProduct.images = product.images;
      await Cart.create({ user: userId, products: newProduct }).then((cart) =>
        res.status(201).json(cart)
      );
    } else {
      const duplicate = cart.products.filter(
        (p) => p._id.toString() === productId
      );
      if (duplicate) {
        const newProduct = duplicate;
        newProduct.quantity = duplicate.quantity + 1;
        newProduct.price = duplicate.price;
        newProduct.description = duplicate.description;
        newProduct.images = duplicate.images;
        // await Cart.findByIdAndUpdate
      }
    }
  }
});

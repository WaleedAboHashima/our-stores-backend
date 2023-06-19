const asnycHandler = require("express-async-handler");
const Admin = require("../models/Stores");
const bcrypt = require("bcrypt");
const { SendOTP, VerifyOTP } = require("../config/OTP");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const ProductSchema = require("../models/Products");
const Rules = require("../models/Rules");
exports.AdminRegister = asnycHandler(async (req, res) => {
  const { email, phone, password, storeName, government, location } = req.body;
  if ((!email || !phone || !password || !storeName || !government, !location)) {
    res.status(404).json({ message: "All Fields Are Required" });
  } else {
    await Admin.findOne({ $or: [{ email }, { phone }] }).then(async (admin) => {
      if (admin) {
        console.log(admin);
        res
          .status(409)
          .json({ message: "Admin with this email or phone already exists." });
      } else {
        await Admin.create({
          email,
          phone,
          password: await bcrypt.hash(password, 10),
          storeName,
          government,
          location,
        }).then((admin) => {
          delete admin._doc.password && delete admin._doc.__v;
          res.status(201).json(admin);
        });
      }
    });
  }
});

exports.AdminLogin = asnycHandler(async (req, res) => {
  const { storeName, email, password } = req.body;
  if (!storeName || !email || !password) {
    res.status(404).json({ message: "All Fields Are Required" });
  } else {
    await Admin.findOne({ email, storeName }).then(async (admin) => {
      if (!admin) {
        res.status(404).json({
          message: "There is no admin account associated with these details.",
        });
      } else {
        const matching = await bcrypt.compare(password, admin.password);
        if (!matching) {
          res.status(403).json({ message: "Password mismatch." });
        } else {
          delete admin._doc.password && delete admin._doc.__v;
          const token = jwt.sign(
            { id: admin.id, role: admin.role },
            process.env.TOKEN,
            { expiresIn: "30d" }
          );
          res.status(200).json({ ...admin.toObject(), token });
        }
      }
    });
  }
});

exports.AddProduct = asnycHandler(async (req, res, next) => {
  const { name, category, price, quantity, sizes, description, imgs } =
    req.body;
  if (!name || !category || !price || !quantity || !description) {
    next(new ApiError("All Fields Are Required", 403));
  } else {
    try {
      const duplicate = await ProductSchema.findOne({ name, category }).exec();
      if (duplicate) {
        return next(new ApiError("Product Already Exists", 409));
      } else {
        await ProductSchema.create({
          name,
          category,
          price,
          quantity,
          sizes,
          description,
        }).then((value, err) => {
          if (err) {
            return res.status(500).json({ message: err });
          } else {
            res.sendStatus(201);
          }
        });
      }
    } catch (err) {
      return next(new ApiError(err, 403));
    }
  }
});



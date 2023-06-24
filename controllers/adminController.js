const asnycHandler = require("express-async-handler");
const Admin = require("../models/Stores");
const bcrypt = require("bcrypt");
const { SendOTP, VerifyOTP } = require("../config/OTP");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const ProductSchema = require("../models/Products");
const Rules = require("../models/Rules");
const Store = require("../models/Stores");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.AdminRegister = asnycHandler(async (req, res, next) => {
  const { email, phone, password, storeName, government, location } = req.body;
  if (!req.files.logo) return next(new ApiError("Logo required.", 403));
  if ((!email || !phone || !password || !storeName || !government, !location)) {
    res.status(404).json({ message: "All Fields Are Required" });
  } else {
    const logo = (await cloudinary.uploader.upload(req.files.logo[0].path))
      .secure_url;
    await Admin.findOne({ $or: [{ email }, { phone }] }).then(async (admin) => {
      if (admin) {
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
          logo: logo.toString(),
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
  const storeId = req.user.id;
  const { productName, category, price, quantity, sizes, description } =
    req.body;
  console.log(sizes)
  const imgs = req.files.imgs;
  if (!imgs) next(new ApiError("Image Required", 403));
  if (!productName || !category || !price || !quantity || !description) {
    next(new ApiError("All Fields Are Required", 403));
  } else {
    try {
      const store = await Store.findById(storeId);
      if (!store) next(new ApiError("User not found.", 404));
      else {
        const duplicate = await ProductSchema.findOne({
          productName,
          category,
        }).exec();
        if (duplicate) {
          return next(new ApiError("Product Already Exists", 409));
        } else {
          const imgs_path = await Promise.all(
            imgs.map(async (img) => {
              const uploadImg = await cloudinary.uploader.upload(img.path);
              return uploadImg.secure_url;
            })
          );
          const newProduct = await ProductSchema.create({
            store,
            productName,
            category,
            price,
            quantity,
            sizes,
            description,
            images: imgs_path,
          });

          await Store.findByIdAndUpdate(storeId, {
            $push: { products: newProduct._id },
          }).then((value, err) => {
            if (err) {
              return res.status(500).json({ message: err });
            } else {
              res.sendStatus(201);
            }
          });
        }
      }
    } catch (err) {
      return next(new ApiError(err, 403));
    }
  }
});

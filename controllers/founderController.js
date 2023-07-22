const Founder = require("../models/Founder");
const Orders = require("../models/Orders");
const Reports = require("../models/Report");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwt = require("jsonwebtoken");
const Rules = require("../models/Rules");
const Users = require("../models/User");
const Stores = require("../models/Stores");
const { default: mongoose } = require("mongoose");
exports.FounderLogin = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;
  if (!email || !password || !phone) {
    res.status(403).json({ message: "All fields are required" });
  } else {
    await Founder.findOne({ email, phone }).then(async (founder) => {
      if (!founder) {
        res.status(404).json({ message: "Founder not found." });
      } else {
        const matching = await bcrypt.compare(password, founder.password);
        if (!matching) {
          res.status(403).json({ message: "Password mismatch." });
        } else {
          delete founder._doc.password && delete founder._doc.__v;
          const token = jwt.sign(
            { id: founder.id, role: founder.role },
            process.env.TOKEN,
            { expiresIn: "30d" }
          );
          res.status(200).json({ ...founder.toObject(), token });
        }
      }
    });
  }
});

exports.FounderRegister = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  await Founder.create({
    email,
    phone,
    password: await bcrypt.hash(password, 10),
  });
  res.sendStatus(201);
});

exports.GetAllUsers = asyncHandler(async (req, res, next) => {
  await Users.find({}).then((users) => {
    const allusers = users.map((user) => {
      const { password, __v, active, ...rest } = user.toObject();
      return rest;
    });
    res.status(200).json(allusers);
  });
});

exports.GetAllStores = asyncHandler(async (req, res, next) => {
  await Stores.find({}).then((stores) => {
    const allstores = stores.map((store) => {
      const { password, __v, role, ...rest } = store.toObject();
      return rest;
    });
    res.status(200).json(allstores);
  });
});

exports.AddRules = asyncHandler(async (req, res, next) => {
  const { type } = req.query;
  if (type === "uses") {
    const { textBody } = req.body;
    if (!textBody)
      return next(new ApiError("Please provide terms of use.", 400));
    await Rules.findOne({ type }).then(async (rule) => {
      if (rule)
        await Rules.findOneAndUpdate({ type }, { textBody }).then((uses) =>
          res.json(uses)
        );
      else
        await Rules.create({ type, textBody }).then((uses) => res.json(uses));
    });
  } else if (type === "privacy") {
    const { textBody } = req.body;
    if (!textBody) return next(new ApiError("Please provide privacy.", 400));
    await Rules.findOne({ type }).then(async (rule) => {
      if (rule)
        await Rules.findOneAndUpdate({ type }, { textBody }).then((privacy) =>
          res.json(privacy)
        );
      else
        await Rules.create({ type, textBody }).then((privacy) =>
          res.json(privacy)
        );
    });
  } else {
    res.status(404).json({ message: "Invalid Rules Type." });
  }
});

exports.DeleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) return next(new ApiError("User Id Required", 403));
  else {
    const valid = mongoose.Types.ObjectId.isValid(userId);
    if (!valid) {
      res.status(403).json({ message: "Invalid Id." });
    } else {
      const user = await Users.findByIdAndDelete({ _id: userId });
      if (user) {
        res.sendStatus(200);
      } else {
        res.status(404).json({ message: "User with this id not found." });
      }
    }
  }
});

exports.DeletStore = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  if (!storeId) return next(new ApiError("User Id Required", 403));
  else {
    const valid = mongoose.Types.ObjectId.isValid(storeId);
    if (!valid) {
      res.status(403).json({ message: "Invalid Id." });
    } else {
      const store = await Users.findById({ _id: storeId });
      if (store) {
        res.sendStatus(200);
      } else {
        res.status(404).json({ message: "Store with this id not found." });
      }
    }
  }
});

exports.GetReports = asyncHandler(async (req, res, next) => {
  await Reports.find({}).then((reports) => {
    if (reports) {
      res.status(200).json({reports});
    } else {
      res.status(404).json({ message: "No Reports Avaliable." });
    }
  });
});

exports.DeleteReport = asyncHandler(async (req, res, next) => {
  const { repId } = req.params;
  try {
    await Reports.findByIdAndDelete(repId).then((report) => {
      if (report) {
        res.sendStatus(200);
      }
      else {
        res.status(404).json({message: 'Feedback not found.'})
      }
    })
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
})

exports.ArchiveOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  if (!orderId) {
    res.status(403).json({ message: "Order Id Required." });
  } else {
    const valid = mongoose.Types.ObjectId.isValid(orderId);
    if (valid) {
      const order = await Orders.findById({ _id: orderId });
      if (order) {
        await Orders.findByIdAndUpdate( orderId, { archived: !order.archived });
        res.sendStatus(200);
      } else {
        res.status(404).json({ message: "Order not found." });
      }
    } else {
      res.status(403).json({ message: "Order Id is Invalid." });
    }
  }
});

exports.top3 = asyncHandler(async (req, res, next) => {
  await Orders.aggregate([
      { $match: { archived: false } }, // Match only non-archived orders
      {
          $group: {
              _id: '$user',
              orderCount: { $sum: 1 },
              user: { $first: '$$ROOT.user' } // Include the user field in the result
          }
      },
      {
          $lookup: {
              from: 'users', // Assuming the user collection is named 'users'
              localField: 'user',
              foreignField: '_id',
              as: 'user'
          }
      },
      {
          $unwind: '$user'
      },
      {
          $project: {
              _id: 0,
              user: {
                  _id: 1,
                  username: 1,
                  email: 1,
                  // Exclude the password field
              },
              orderCount: 1
          }
      },
      { $sort: { orderCount: -1 } }, // Sort in descending order of order count
      { $limit: 3 } // Limit the result to 3 documents
  ]).then((orders) => res.json({ orders }))
})
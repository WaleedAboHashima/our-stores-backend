const mongoose = require('mongoose');

module.exports = mongoose.model("User", new mongoose.Schema({
    username: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String
    },
    phone: {
        required: true,
        type: Number
    },
    location: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Founder", "User", "Admin", "SR"],
        default: "User",
    },
    active: {
        type: Boolean,
        default: false
    }
}))
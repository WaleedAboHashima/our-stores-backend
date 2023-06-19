const mongoose = require('mongoose');

const Founder = mongoose.model(
    "Founders", new mongoose.Schema({
        email: {
            required: true,
            type: String,
        },
        phone: {
            required: true,
            type: Number
        },
        password: {
            required: true,
            type: String
        },
        role: {
            type: String,
            default: 'Founder'
        }
    }, {collection: "Founders"})
)

module.exports = Founder;
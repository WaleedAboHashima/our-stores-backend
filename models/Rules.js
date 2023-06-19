const mongoose = require('mongoose');

module.exports = mongoose.model('Rules', new mongoose.Schema({
    type: {
        type: String,
        enum: ['uses', 'privacy']
    },
    textBody: String,
},
{timestamps : true},
))
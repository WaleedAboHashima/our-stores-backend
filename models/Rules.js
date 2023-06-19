const mongoose = require('mongoose');

module.exports = mongoose.model('Rules', new mongoose.Schema({
    type: {
        type: String,
        enum: ['termsofuse', 'privacy']
    },
    textBody: String,
},
{collection: "Rules"},
))
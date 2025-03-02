const mongoose = require('mongoose');

const userSchemas = new mongoose.Schema({
    username: String,
    email: String,
    role: {
        type: Number,
        default: 4
    },
    mobilePhone: {
        type: Number,
        default: 0
    },
    fullName: String,
    password: String,
});

module.exports = mongoose.model('user', userSchemas);

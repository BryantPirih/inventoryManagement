const mongoose = require('mongoose');

const workerSchemas = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    role: {
        type: Number,
        default: 3
    },
    mobilePhone: {
        type: Number,
        default: 0
    },
    warehouseId: String,
    password: String,
});

module.exports = mongoose.model('worker', workerSchemas);

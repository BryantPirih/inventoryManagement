const mongoose = require('mongoose');

const productSchemas = new mongoose.Schema({
    id: String,
    name: String,
    stock: String,
    category: String,
    unit: String,
    unitConversion: String,
    price : Number,
    description: String,
    warehouseId : String,
    lastUpdate : Date,
    status : {
        type : Number,
        default : 1
    },
    reason : {
        type : String,
        default : ""
    },
    updatedBy : {
        type : String,
        default : ""
    }
});

module.exports = mongoose.model('product', productSchemas);
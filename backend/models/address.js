const mongoose = require('mongoose');

const addressSchemas = new mongoose.Schema({
    username : String,
    id : String,
    fullAddress: String,
    province : String,
    provinceID : Number,
    city: String,
    cityID : Number,
    district: String,
    subDistrict: String,
    postalCode: Number,
    recipientName : String,
    recipientEmail : String,
    recipientPhone : Number,
});

module.exports = mongoose.model('address', addressSchemas);
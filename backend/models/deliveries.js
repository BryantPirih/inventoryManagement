// models/deliveries.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  id: String, 
  orderId: String,
  fullAddress: String,
  province: String,
  provinceID: Number,
  city: String,
  cityID: Number,
  district: String,
  subDistrict: String,
  postalCode: Number,
  recipientName: String,
  recipientEmail: String,
  recipientPhone: Number
});

module.exports = mongoose.model("Delivery", deliverySchema);

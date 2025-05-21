const mongoose = require('mongoose');

const productSchemas = new mongoose.Schema({
  id: String,
  name: String,
  stock: Number,
  categoryId: String,
  unit: String,
  unitConversion: String,
  price: Number,
  description: String,
  warehouseId: String,
  lastUpdate: Date,
  status: {
    type: Number,
    default: 1
  },
  reason: {
    type: String,
    default: ""
  },
  updatedBy: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    default: ""
  } // ✅ added here
});

module.exports = mongoose.model('product', productSchemas);

const mongoose = require('mongoose');

const stockOpnameSchema = new mongoose.Schema({
  id: String, // optional: like "OP01", "OP02"
  productId: String,
  warehouseId: String,
  oldStock: Number,
  newStock: Number,
  difference: Number,
  reason: String,
  opnameDate: {
    type: Date,
    default: Date.now
  },
  updatedBy: String
});

module.exports = mongoose.model('stockOpname', stockOpnameSchema);

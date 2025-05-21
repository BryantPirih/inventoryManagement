const mongoose = require('mongoose');

const orderSchemas = new mongoose.Schema({
  id: String,
  username: String,
  items: [
    {
      productId: String,
      productName: String,
      quantity: Number
    }
  ],
  paymentMethod: Number,
  deliveryMethod: Number,
  orderDate: Date,
  status: Number,
  discountCode: String,
  totalPayment: Number,
  notifiedStatuses: [Number],
  receivedBy: String,
  deliveredDate: Date,
  warehouseId: String 
});

module.exports = mongoose.model('order', orderSchemas);

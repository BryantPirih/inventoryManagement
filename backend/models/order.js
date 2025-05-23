const mongoose = require('mongoose');

const orderSchemas = new mongoose.Schema({
  id: String,
  username: String,
  items: [
    {
      productId: String,
      productName: String,
      quantity: Number,
      price: Number,  // ✅ snapshot of price at time of order
      total: Number   // ✅ quantity * price
    }
  ],
  paymentMethod: Number,
  deliveryMethod: Number,
  orderDate: Date,
  status: Number,
  discountCode: String,
  totalPayment: Number,
  deliveryId: String,         // ✅ link to delivery table
  notifiedStatuses: [Number],
  receivedBy: String,
  deliveredDate: Date,
  warehouseId: String
});

module.exports = mongoose.model('Order', orderSchemas);


module.exports = mongoose.model('order', orderSchemas);

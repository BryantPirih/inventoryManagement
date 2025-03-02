const mongoose = require('mongoose');

const orderSchemas = new mongoose.Schema({
    id: String,
    username : String,
    productId : String,
    productName : String,
    paymentMethod : Number,
    deliveryMethod: Number,
    quantity : String,
    orderDate : Date,
    status : Number,
    discountCode : String,
    totalPayment: Number
});

module.exports = mongoose.model('order', orderSchemas);
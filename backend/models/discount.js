const mongoose = require('mongoose');

const discountSchemas = new mongoose.Schema({
    id: String,
    name: String,
    discountCode: String,
    paymentMethod: Number,
    discountType: Number,
    fixedAmountDiscount: Number,
    percentageDiscount: Number,
    discountStart: Date,
    discountEnd: Date,
    minimumTransaction: Number,
    usageLimit: Number
});

module.exports = mongoose.model('discount', discountSchemas);
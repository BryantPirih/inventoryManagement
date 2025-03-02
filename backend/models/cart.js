const mongoose = require('mongoose');

const cartSchemas = new mongoose.Schema({
    id: String,
    username: String,
    item: [{
        productID : String,
        productName : String,
        qty : Number
    }]
});

module.exports = mongoose.model('cart', cartSchemas);
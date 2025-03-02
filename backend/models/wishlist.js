const mongoose = require('mongoose');

const wishlistSchemas = new mongoose.Schema({
    id: String,
    username: String,
    item: [{
        productID : String,
        productName : String,
    }]
});

module.exports = mongoose.model('wishlist', wishlistSchemas);
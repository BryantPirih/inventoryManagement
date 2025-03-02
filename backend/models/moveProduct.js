const mongoose = require('mongoose');

const moveProductSchemas = new mongoose.Schema({
    id : String,
    moveId : String,
    productId: String,
    quantity : Number
});

module.exports = mongoose.model('moveProduct', moveProductSchemas);
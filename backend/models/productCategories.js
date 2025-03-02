const mongoose = require('mongoose');

const productCategoriesSchemas = new mongoose.Schema({
    categoriesName: String,
    unit: String,
    unitConversion: String
});

module.exports = mongoose.model('productCategories', productCategoriesSchemas);
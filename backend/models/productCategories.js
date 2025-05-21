const mongoose = require('mongoose');

const productCategoriesSchemas = new mongoose.Schema({
  id: String,
  categoriesName: String,
  unit: String,
  unitConversion: String,
  iconUrl: {
    type: String,
    default: ""
  },
  conversionRate: {
    type: Number,
    default: 1 // e.g., for granit: 1 pack = 6 biji
  }
});

module.exports = mongoose.model('productCategories', productCategoriesSchemas);

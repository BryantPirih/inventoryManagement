const mongoose = require('mongoose');

const moveProductSchemas = new mongoose.Schema({
  moveId: String, // FK to 'move'
  products: [
    {
      productId: String,
      quantity: Number,
      unitPrice: Number, // Harga Jual (per item)
      total: Number,     // quantity * unitPrice
      description: String
    }
  ]
});

module.exports = mongoose.model('moveProduct', moveProductSchemas);

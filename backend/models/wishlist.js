const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  id: String, // optional unique ID if you're not using _id
  username: { type: String, required: true },
  items: [
    {
      productID: { type: String, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, default: 1 }, // quantity the user wants
      status: { type: String, enum: ['in-stock', 'out-of-stock'], default: 'out-of-stock' },
      notified: { type: Boolean, default: false }, // if user has been notified of restock
      addedAt: { type: Date, default: Date.now } // optional: for sorting or analytics
    }
  ]
});

module.exports = mongoose.model('wishlist', wishlistSchema);

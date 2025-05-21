const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema({
  id: String,
  orderId: String,
  productId: String,
  username: String,
  reason: String,         // User's reason
  mediaUrl: String,
  requestDate: Date,
  status: {
    type: Number,
    default: 0,           // 0 = pending, 1 = approved, 2 = rejected
  },
  adminNote: String       // 💡 NEW: Admin’s optional reason (for rejection/notes)
});

module.exports = mongoose.model("returnRequest", returnRequestSchema);

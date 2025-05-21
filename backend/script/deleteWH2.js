const mongoose = require("mongoose");

// Only import the Product model
const Product = require("../models/product.js");

// Replace with your actual Mongo URI
const MONGO_URI = "mongodb+srv://bryantpirih:1234@clusterta.xcndkot.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ Connected to MongoDB");

  try {
    const result = await Product.deleteMany({ warehouseId: "WH2" });
    console.log(`🗑️ Deleted ${result.deletedCount} products from WH2.`);
  } catch (err) {
    console.error("❌ Error deleting WH2 products:", err);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error("❌ Connection error:", err);
});

const mongoose = require("mongoose");

// Import only the required models
const Product = require("../models/product.js");
const ProductCategories = require("../models/productCategories.js");

// Replace with your actual DB name
const MONGO_URI = "mongodb+srv://bryantpirih:1234@clusterta.xcndkot.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ Connected to MongoDB");

  try {
    await Product.deleteMany({});
    console.log("🗑️ All products deleted.");

    await ProductCategories.deleteMany({});
    console.log("🗑️ All product categories deleted.");
  } catch (err) {
    console.error("❌ Error deleting data:", err);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error("❌ Connection error:", err);
});

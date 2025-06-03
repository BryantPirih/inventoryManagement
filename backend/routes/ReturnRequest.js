const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ReturnRequest = require("../models/returnRequest");
const Product = require("../models/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/returns"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'return-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

router.post("/new", upload.single("file"), async (req, res) => {
  try {
    const { orderId, productId, username, reason } = req.body;
    const file = req.file;

    if (!orderId || !productId || !username || !reason || !file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReturn = new ReturnRequest({
      orderId,
      productId,
      username,
      reason,
      mediaUrl: `/uploads/returns/${file.filename}`,
      requestDate: new Date(),
      status: 0, 
    });

    await newReturn.save();
    res.status(201).json({ message: "Return request created successfully", returnRequest: newReturn });
  } catch (error) {
    console.error("Error saving return request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const allReturns = await ReturnRequest.find();

    const enriched = await Promise.all(
      allReturns.map(async (r) => {
        const product = await Product.findOne({ id: r.productId });
        return {
          ...r._doc,
          productName: product?.name || "(Produk tidak ditemukan)",
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Error fetching return requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/get/:id", async (req, res) => {
  try {
    const oneReturn = await ReturnRequest.findById(req.params.id);
    if (!oneReturn) return res.status(404).json({ message: "Return request not found" });

    const product = await Product.findOne({ id: oneReturn.productId });

    const enriched = {
      ...oneReturn._doc,
      productName: product?.name || "(Produk tidak ditemukan)",
    };

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Error fetching return request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/status/:id", async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const updated = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNote,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Return request not found" });

    res.status(200).json({ message: "Return request updated", updated });
  } catch (err) {
    console.error("Error updating return request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const userReturns = await ReturnRequest.find({ username: req.params.username });

    const enriched = await Promise.all(
      userReturns.map(async (r) => {
        const product = await Product.findOne({ id: r.productId });
        return {
          ...r._doc,
          productName: product ? product.name : "(Produk tidak ditemukan)"
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Gagal mengambil data retur user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;

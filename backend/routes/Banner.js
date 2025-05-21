const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Banner = require('../models/banner');

// Multer setup
const bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/banners'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'banner-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: bannerStorage });

// Upload banner
router.post('/upload', upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `/uploads/banners/${req.file.filename}`;
    const banner = new Banner({ imageUrl });
    await banner.save();

    res.status(201).json({ message: 'Banner uploaded successfully', banner });
  } catch (err) {
    console.error('Upload banner error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ uploadedAt: -1 });
    res.status(200).json(banners);
  } catch (err) {
    console.error('Fetch banner error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ProductCategories = require('../models/productCategories');

router.get('/', async (req, res)=>{
  const pc = await ProductCategories.find();
  res.status(201).json(pc)
});

router.post('/new', async (req, res) => {
  try {
    const { categoriesName, unit, unitConversion, conversionRate } = req.body;

    // ✅ Unique ID: PC + timestamp
    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `PC${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const newCategories = new ProductCategories({
      id,
      categoriesName,
      unit,
      unitConversion,
      conversionRate: conversionRate || 1
    });

    await newCategories.save();
    res.status(201).json({ message: 'Category created successfully', categories: newCategories });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProductCategories.findOneAndDelete({ id: req.params.id })
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/productCategories'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'category-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: categoryStorage });

router.post('/upload-icon', upload.single('icon'), async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!req.file || !categoryId) {
      return res.status(400).json({ message: 'Icon and categoryId required' });
    }

    const iconUrl = `/uploads/productCategories/${req.file.filename}`;

    await ProductCategories.findOneAndUpdate(
      { id: categoryId },
      { iconUrl: iconUrl }
    );

    res.status(200).json({ message: 'Icon uploaded and category updated', iconUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
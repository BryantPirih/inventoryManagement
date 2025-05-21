const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const Product = require('../models/product');

// Get all wishlists (admin/dev use)
router.get('/', async (req, res) => {
  try {
    const wishlists = await Wishlist.find();
    res.status(200).json(wishlists);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add to wishlist (create or update)
router.post('/new', async (req, res) => {
  try {
    const { username, items } = req.body;

    // ✅ Find or create a wishlist for the user
    let wishlist = await Wishlist.findOne({ username });

    if (!wishlist) {
      // ✅ Generate safe wishlist ID
      const now = new Date();
      const pad = (n, width) => n.toString().padStart(width, '0');
      const id = `W${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

      wishlist = new Wishlist({
        username,
        id,
        items: []
      });
    }

    for (let reqItem of items) {
      const product = await Product.findOne({ id: reqItem.productID });
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${reqItem.productID} not found` });
      }

      const status = product.stock > 0 ? 'in-stock' : 'out-of-stock';
      const qtyToAdd = reqItem.quantity || 1;

      // Check if product already in wishlist
      const existing = wishlist.items.find(i => i.productID === reqItem.productID);

      if (existing) {
        existing.quantity += qtyToAdd;
        existing.status = status;
      } else {
        wishlist.items.push({
          productID: reqItem.productID,
          productName: product.name,
          quantity: qtyToAdd,
          status,
          notified: false,
          addedAt: Date.now()
        });
      }
    }

    await wishlist.save();
    res.status(200).json({ message: 'Wishlist updated', wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get wishlist by username
router.get('/get/:username', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ username: req.params.username });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.status(200).json({ data: wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete wishlist by username
router.delete('/delete/:username', async (req, res) => {
  try {
    const result = await Wishlist.findOneAndDelete({ username: req.params.username });

    if (!result) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ message: 'Wishlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

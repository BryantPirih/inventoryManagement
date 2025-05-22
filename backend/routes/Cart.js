const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');

router.get('/', async (req, res)=>{
  const carts = await Cart.find();
  res.status(201).json(carts)
});

router.post('/new', async (req, res) => {
  try {
    const { username, item } = req.body;
    const productID = item[0].productID;
    const qty = item[0].qty;

    let cart = await Cart.findOne({ username });

    const product = await Product.findOne({ id: productID });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ✅ Generate unique cart ID if needed
    if (!cart) {
      const now = new Date();
      const pad = (n, width) => n.toString().padStart(width, '0');
      const id = `C${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

      cart = new Cart({
        username,
        id,
        item: [{
          productID,
          productName: product.name,
          qty
        }]
      });
      await cart.save();
      return res.status(201).json({ message: 'Cart created', cart });
    }

    // 🛒 Update existing cart
    const existingItem = cart.item.find(i => i.productID === productID);

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.item.push({
        productID,
        productName: product.name,
        qty
      });
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });

  } catch (error) {
    console.error('Error creating/updating cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update/:cartId/:itemId', async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { qty } = req.body;

    if (qty < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.item.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.qty = qty;

    await cart.save();
    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/get/:username', async (req, res)=>{
    const oneCart = await Cart.findOne({username : req.params.username});
    res.status(201).json({data : oneCart})
});

router.delete('/delete/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await Cart.findOneAndDelete({ username });

        if (!result) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deleteItem/:username/:productID', async (req, res) => {
  const { username, productID } = req.params;

  try {
    const cart = await Cart.findOne({ username });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    const initialLength = cart.item.length;
    cart.item = cart.item.filter(i => i.productID !== productID);

    if (cart.item.length === initialLength) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // If no items left, you may choose to delete the entire cart
    if (cart.item.length === 0) {
      await Cart.deleteOne({ username });
      return res.status(200).json({ message: 'Item deleted. Cart is now empty and removed.' });
    }

    await cart.save();
    res.status(200).json({ message: 'Item deleted from cart', cart });

  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
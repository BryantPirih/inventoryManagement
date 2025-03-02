const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');

router.get('/', async (req, res)=>{
  const carts = await Cart.find();
  res.status(201).json(carts)
});

router.post('/new', async (req, res)=>{
    try {
        const { username, item } = req.body;
        const id = username.toUpperCase().substring(0,1)+"C01"

        const oneProduct = await Product.findOne({id : item[0].productID});

        const newCart = new Cart({
            username,
            id,
            item : {
                productID : item[0].productID,
                productName : oneProduct.name,
                qty : item[0].qty
            }
        });
        await newCart.save();
        res.status(201).json({ message: 'cart created successfully', cart: newCart });
    } catch (error) {
        // Handle errors
        console.error('Error creating Product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get/:username', async (req, res)=>{
    const oneCart = await Cart.findOne({username : req.params.username});
    res.status(201).json({data : oneCart})
});

module.exports = router;
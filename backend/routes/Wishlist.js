const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const Product = require('../models/product');

router.get('/', async (req, res)=>{
  const wishlists = await Wishlist.find();
  res.status(201).json(wishlists)
});

router.post('/new', async (req, res)=>{
    try {
        const { username, item } = req.body;
        const id = username.toUpperCase().substring(0,1)+"W01"

        const oneProduct = await Product.findOne({id : item[0].productID});

        const newWishlist = new Wishlist({
            username,
            id,
            item : {
                productID : item[0].productID,
                productName : oneProduct.name
            }
        });
        await newWishlist.save();
        res.status(201).json({ message: 'wishlist created successfully', wishlist: newWishlist });
    } catch (error) {
        // Handle errors
        console.error('Error creating Product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get/:username', async (req, res)=>{
    const oneWishlist = await Wishlist.findOne({username : req.params.username});
    res.status(201).json({data: oneWishlist})
});

module.exports = router;
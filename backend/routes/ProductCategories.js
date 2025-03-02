const express = require('express');
const router = express.Router();
const ProductCategories = require('../models/productCategories');

router.get('/', async (req, res)=>{
  const pc = await ProductCategories.find();
  res.status(201).json(pc)
});

router.post('/new', async (req, res)=>{
    try {
      
      const { categoriesName, unit, unitConversion} = req.body;

      const newCategories = new ProductCategories({
        categoriesName,
        unit,
        unitConversion
      });

      await newCategories.save();
      res.status(201).json({ message: 'User created successfully', categories: newCategories });
    } catch (error) {
      // Handle errors
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
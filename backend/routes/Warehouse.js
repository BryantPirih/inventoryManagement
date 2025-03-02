const express = require('express');
const router = express.Router();
const Warehouse = require('../models/warehouse');

router.get('/', async (req, res)=>{
  const warehouses = await Warehouse.find();
  res.status(201).json(warehouses)
});

router.post('/new', async (req, res)=>{
    try {
      
      const {warehouse, address, province,city} = req.body;
      const warehouses = await Warehouse.find();
      const length = warehouses.length +1
      const provinceId = 11
      const cityId= 247
      const main = 1
      const id = warehouse.substring(0,1) + "0"+length

      const newWarehouse = new Warehouse({
            id,
            warehouse,  
            address,
            province,
            provinceId,
            city,
            cityId,
            main
        });

      await newWarehouse.save();
      res.status(201).json({ message: 'User created successfully', warehouse: newWarehouse });
    } catch (error) {
      // Handle errors
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
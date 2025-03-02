const express = require('express');
const router = express.Router();
const Address = require('../models/address');

router.get('/', async (req, res)=>{
  const addresses = await Address.find();
  res.status(201).json(addresses)
});

router.post('/new', async (req, res)=>{
    try {
        const { username, 
            fullAddress, 
            province,
            provinceID, 
            city, 
            cityID, 
            district, 
            subDistrict, 
            postalCode, 
            recipientName, 
            recipientEmail, 
            recipientPhone } = req.body;
        const id = username.toUpperCase().substring(0,1)+"A01"
        const newAddress = new Address({
            username,
            id,
            fullAddress,
            province,
            city,
            district,
            subDistrict,
            postalCode,
            recipientName,
            recipientEmail,
            recipientPhone
        });
        await newAddress.save();
        res.status(201).json({ message: 'address created successfully', address: newAddress });
    } catch (error) {
        console.error('Error creating Address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get/:username', async (req, res)=>{
    const oneAddress = await Address.findOne({username : req.params.username});
    res.status(201).json({data : oneAddress})
});

module.exports = router;
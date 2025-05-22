const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const Warehouse = require('../models/warehouse');


router.get('/province', async (req, res) => {
    try {
      const serverKey = process.env.RAJAONGKIR_API_KEY
      const response = await axios.get('https://api.rajaongkir.com/starter/province', {
        headers: {
          key: serverKey,
        },
        params: {
          id: '12' 
        },
      });
  
      // Send the response back to the client
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Failed to fetch province data' });
    }
});

router.get('/allProvince', async (req, res) => {
    try {
      console.log("test masuk province")
      const serverKey = process.env.RAJAONGKIR_API_Key
      const response = await axios.get('https://api.rajaongkir.com/starter/province', {
        headers: {
          key: serverKey,
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Failed to fetch province data' });
    }
});

router.get('/city', async (req, res) => {
    try {
      const serverKey = process.env.RAJAONGKIR_API_Key
      const response = await axios.get('https://api.rajaongkir.com/starter/city', {
        headers: {
          key: serverKey,
        },
        params: {
          id: '39',
          province: '5'
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Failed to fetch province data' });
    }
});

router.get('/allCity', async (req, res) => {
    try {
      console.log("test masuk city")
      const serverKey = process.env.RAJAONGKIR_API_Key
      const response = await axios.get('https://api.rajaongkir.com/starter/city', {
        headers: {
          key: serverKey,
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Failed to fetch province data' });
    }
});

router.post('/cekOngkir', async (req, res) => {
  try {
    const serverKey = process.env.RAJAONGKIR_API_KEY;
    const { destination } = req.body;
    const warehouse = await Warehouse.find({main : 0})
    const origin  = warehouse[0].cityId
    console.log("origin : " + origin)
    console.log( "destination : " + destination)
    console.log( "serverkey : " +serverKey)
    const response = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      {
        origin: origin, 
        destination,   
        weight: 1000,
        courier: 'jne',
      },
      {
        headers: {
          key: serverKey,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch shipping cost data' });
  }
});

module.exports = router;
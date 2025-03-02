const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();


router.get('/province', async (req, res) => {
    try {
      const serverKey = process.env.RAJAONGKIR_API_Key
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
  
      // Send the response back to the client
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Failed to fetch province data' });
    }
});

router.post('/cekOngkir', async (req, res) => {
  try {
    const serverKey = process.env.RAJAONGKIR_API_Key
    const response = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      {
        origin: '444',
        destination: '247',
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

    // Send the response back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch shipping cost data' });
  }
});

module.exports = router;
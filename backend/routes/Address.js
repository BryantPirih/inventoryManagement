const express = require('express');
const router = express.Router();
const Address = require('../models/address');
const Province = require('../models/provinces');
const Cities = require('../models/cities');

// Endpoint to get all addresses for a user
router.get('/all/:username', async (req, res) => {
  try {
    const allAddresses = await Address.find({ username: req.params.username });
    res.status(200).json({ data: allAddresses });
  } catch (error) {
    console.error('Error fetching all addresses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to create a new address
router.post('/new', async (req, res) => {
  try {
    const {
      username,
      fullAddress,
      provinceId,
      cityId,
      district,
      subDistrict,
      postalCode,
      recipientName,
      recipientEmail,
      recipientPhone
    } = req.body;

    const isDefault = await Address.findOne({ username: username, isDefault: 0 });
    let province_name = "", city_name = "";
    let defaultTemp = isDefault ? 1 : 0;

    const provinces = await Province.aggregate([
      { $unwind: "$province" },
      { $replaceRoot: { newRoot: "$province" } },
      { $sort: { province_id: 1 } }
    ]);

    const cities = await Cities.aggregate([
      { $unwind: "$city" },
      { $replaceRoot: { newRoot: "$city" } },
      { $sort: { city_name: 1 } }
    ]);

    for (let i = 0; i < provinces.length; i++) {
      if (provinceId == provinces[i].province_id) {
        province_name = provinces[i].province;
        break;
      }
    }

    for (let i = 0; i < cities.length; i++) {
      if (cityId == cities[i].city_id) {
        city_name = cities[i].type + " " + cities[i].city_name;
        break;
      }
    }

    // ✅ Safe address ID with timestamp
    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `A${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const newAddress = new Address({
      username,
      id,
      fullAddress,
      province: province_name,
      provinceID: provinceId,
      city: city_name,
      cityID: cityId,
      district,
      subDistrict,
      postalCode,
      recipientName,
      recipientEmail,
      recipientPhone,
      isDefault: defaultTemp
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address created successfully', address: newAddress });
  } catch (error) {
    console.error('Error creating Address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update default address
router.put("/updateDefault/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isDefault, username, ...otherData } = req.body;

    if (isDefault === 0) {
      await Address.updateMany({ username }, { $set: { isDefault: 1 } });
    }

    const updated = await Address.findByIdAndUpdate(id, {
      ...otherData,
      isDefault
    }, { new: true });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get default address for a user
router.get('/get/:username', async (req, res) => {
  try {
    const defaultAddress = await Address.findOne({ username: req.params.username, isDefault: 0 });
    res.status(200).json({ data: defaultAddress });
  } catch (error) {
    console.error('Error fetching default address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

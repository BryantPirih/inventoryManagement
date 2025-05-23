// routes/Deliveries.js
const express = require('express');
const router = express.Router();
const Delivery = require('../models/deliveries');

// POST /delivery/new — create a new delivery
router.post("/new", async (req, res) => {
  try {
    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const newId = `D${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const newDelivery = new Delivery({
      id: newId,
      orderId: req.body.orderId,
      fullAddress: req.body.fullAddress,
      province: req.body.province,
      provinceID: req.body.provinceID,
      city: req.body.city,
      cityID: req.body.cityID,
      district: req.body.district,
      subDistrict: req.body.subDistrict,
      postalCode: req.body.postalCode,
      recipientName: req.body.recipientName,
      recipientEmail: req.body.recipientEmail,
      recipientPhone: req.body.recipientPhone
    });

    await newDelivery.save();
    res.status(201).json({ message: "Delivery created", delivery: newDelivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /delivery/:orderId — get delivery by order ID
router.get("/:orderId", async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId });
    console.log(req.params.orderId)
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json({ delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

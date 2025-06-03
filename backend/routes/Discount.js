const express = require('express');
const router = express.Router();
const Discount = require('../models/discount');

router.get('/', async (req, res)=>{
  const discounts = await Discount.find();
  res.status(201).json(discounts)
});

router.post('/new', async (req, res) => {
  try {
    const {
      name,
      discountCode,
      paymentMethod,
      discountType,
      fixedAmountDiscount,
      percentageDiscount,
      discountStart,
      discountEnd,
      minimumTransaction,
      usageLimit
    } = req.body;

    // ✅ Safe unique ID for discount
    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `D${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const newDiscount = new Discount({
      id,
      name,
      discountCode,
      paymentMethod,
      discountType,
      fixedAmountDiscount,
      percentageDiscount,
      discountStart,
      discountEnd,
      minimumTransaction,
      usageLimit
    });

    await newDiscount.save();
    res.status(201).json({ message: 'discount created successfully', discount: newDiscount });
  } catch (error) {
    console.error('Error creating Discount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/get/:discountCode', async (req, res)=>{
    const oneDiscount = await Discount.findOne({discountCode : req.params.discountCode});
    res.status(201).json({data : oneDiscount})
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Discount.deleteOne({ id: req.params.id });
    res.status(200).json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
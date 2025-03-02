const express = require('express');
const router = express.Router();
const Discount = require('../models/discount');

router.get('/', async (req, res)=>{
  const discounts = await Discount.find();
  res.status(201).json(discounts)
});

router.post('/new', async (req, res)=>{
    try {
        const { name, 
                discountCode, 
                paymentMethod, 
                discountType, 
                fixedAmountDiscount, 
                percentageDiscount, 
                discountStart, 
                discountEnd, 
                minimumTransaction, 
                usageLimit } = req.body;

        const id = name.toUpperCase().substring(0,1)+"A01"
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
module.exports = router;
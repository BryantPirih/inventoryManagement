const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.get('/', async (req, res)=>{
  const order = await Order.find();
  res.status(201).json(order)
});

router.post('/new', async (req, res)=>{
    try {
        const { username,
                productId, 
                productName, 
                paymentMethod, 
                deliveryMethod, 
                quantity, 
                discountCode, 
                totalPayment,
                status
                } = req.body;


        const order = await Order.find();
        const length = order.length +1 
        const id = username.toUpperCase().substring(0,1)+"O0"+length
        console.log(id)
        const orderDate = new Date()
        const newOrder = new Order({
            id,
            username,
            productId,
            productName,
            paymentMethod,
            deliveryMethod,
            quantity,
            orderDate,
            status,
            discountCode,
            totalPayment
        });
        await newOrder.save();
        res.status(201).json({ message: 'order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get/:id', async (req, res)=>{
    const oneOrder = await Order.findOne({id : req.params.id});
    res.status(201).json({data : oneOrder})
});

router.get('/getAllOrderUser/:username', async (req, res)=>{
    const orderUser = await Order.find({username : req.params.username});
    res.status(201).json({data : orderUser})
});

router.put('/updateOrder/:id', async (req, res)=>{
    const  {id}  = req.params; 
    const {updateStatus} = req.body; 
    let newStatus = updateStatus+1
    const updatedOrder = await Order.findOneAndUpdate(
        {id: id},           
        { $set: {status : newStatus} },
        { new: true }
    );

    res.status(200).json(updatedOrder);
});

module.exports = router;
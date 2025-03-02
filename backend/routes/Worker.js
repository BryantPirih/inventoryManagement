const express = require('express');
const router = express.Router();
const Worker = require('../models/worker');

router.get('/', async (req, res)=>{
  const workers = await Worker.find();
  res.status(201).json(workers)
});

router.post('/new', async (req, res)=>{
    try {
        const { username, name, email, role, mobilePhone , warehouseId, password } = req.body;
        console.log(mobilePhone)
        const newWorker = new Worker({
            username,
            name,
            email,
            role,
            mobilePhone,
            warehouseId,
            password
        });
        await newWorker.save();
        res.status(201).json({ message: 'worker created successfully', worker: newWorker });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
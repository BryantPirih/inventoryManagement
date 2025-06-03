const express = require('express');
const router = express.Router();
const Worker = require('../models/worker');
const bcrypt = require('bcrypt');


router.get('/', async (req, res)=>{

    const { username, role } = req.query;

    try {
        if (role === "1") {
            const workers = await Worker.find();
            return res.json(workers);
        } else if (role === "2") {
            const manager = await Worker.findOne({ username });
            if (!manager) return res.status(404).json({ message: "Manager not found" });
                const workers = await Worker.find({warehouseId: manager.warehouseId });
                return res.json(workers);
            } else {
                return res.status(403).json({ message: "Unauthorized" });
            }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
    const workers = await Worker.find();
    res.status(201).json(workers)
});

router.post('/new', async (req, res) => {
  try {
    const { username, name, email, role, mobilePhone, warehouseId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newWorker = new Worker({
      username,
      name,
      email,
      role,
      mobilePhone,
      warehouseId,
      password: hashedPassword
    });

    await newWorker.save();
    res.status(201).json({ message: 'worker created successfully', worker: newWorker });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/get/:username', async (req, res) => {
    try {
        const worker = await Worker.findOne({ username: req.params.username});
        res.status(200).json({ data: worker });
    } catch (error) {
        console.error('Error fetching one worker:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
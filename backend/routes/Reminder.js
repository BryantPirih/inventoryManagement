const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminder');

router.get('/', async (req, res)=>{
  const reminders = await Reminder.find();
  res.status(201).json(reminders)
});

router.post('/new', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    const length = reminders.length + 1;
    const id = "RE" + length;

    const { title, message, remindAt, createdBy } = req.body;

    const newReminder = new Reminder({
      id: id,
      title: title,
      message: message,
      remindAt: new Date(remindAt),
      isSent: false,
      createdBy: createdBy,
      createdAt: new Date()  
    });

    await newReminder.save(); 
    res.status(201).json({ message: 'Reminder created successfully', reminder: newReminder });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
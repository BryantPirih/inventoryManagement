const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminder');

router.get('/', async (req, res)=>{
  const reminders = await Reminder.find();
  res.status(201).json(reminders)
});

router.post('/new', async (req, res) => {
  try {
    const { title, message, remindAt, createdBy } = req.body;

    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `RE${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const newReminder = new Reminder({
      id,
      title,
      message,
      remindAt: new Date(remindAt),
      isSent: false,
      createdBy,
      createdAt: now
    });

    await newReminder.save();
    res.status(201).json({ message: 'Reminder created successfully', reminder: newReminder });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ DELETE /reminder/:id — delete reminder by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOne({ id });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    await Reminder.deleteOne({ id });
    res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting reminder:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;

const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const mongoose = require('mongoose');

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const notifications = await Notification.find({ username })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/mark-read/:id', async (req, res) => {
  const id = req.params.id;

  console.log('🔍 Received ID:', id);

  // Check if ID format is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('❌ Invalid ObjectId format!');
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      console.log('⚠️ Notification not found for ID:', id);
      return res.status(404).json({ message: 'Notification not found' });
    }

    console.log('✅ Marked as read:', updated._id);
    res.json(updated);

  } catch (err) {
    console.error('❌ Failed in findByIdAndUpdate:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/mark-all-read/:username', async (req, res) => {
  try {
    await Notification.updateMany({ username: req.params.username, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
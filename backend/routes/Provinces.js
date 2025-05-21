const express = require('express');
const router = express.Router();
const Province = require('../models/provinces');

router.get('/', async (req, res) => {
  try {
    const provinces = await Province.aggregate([
      { $unwind: "$province" },
      { $replaceRoot: { newRoot: "$province" } },
      { $sort: { province_id: 1 } } // optional: sort alphabetically
    ]);

    res.json(provinces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
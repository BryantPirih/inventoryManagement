const express = require('express');
const router = express.Router();
const Cities = require('../models/cities');

router.get('/', async (req, res) => {
  try {
    const cities = await Cities.aggregate([
      { $unwind: "$city" },
      { $replaceRoot: { newRoot: "$city" } },
      { $sort: { city_name: 1 } } // optional: sort alphabetically
    ]);

    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
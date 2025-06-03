const express = require('express');
const router = express.Router();
const Warehouse = require('../models/warehouse');
const Province = require('../models/provinces');
const Cities = require('../models/cities');

router.get('/', async (req, res)=>{
  const warehouses = await Warehouse.find();
  res.status(201).json(warehouses)
});

router.post('/new', async (req, res) => {
  try {
    const { warehouse, address, province, city } = req.body;

    // ✅ Determine if this is main warehouse
    const isMain = await Warehouse.findOne({ main: 0 });
    const main = isMain ? 1 : 0;

    let province_name = "", city_name = "";

    const provinces = await Province.aggregate([
      { $unwind: "$province" },
      { $replaceRoot: { newRoot: "$province" } },
      { $sort: { province_id: 1 } }
    ]);

    const cities = await Cities.aggregate([
      { $unwind: "$city" },
      { $replaceRoot: { newRoot: "$city" } },
      { $sort: { city_name: 1 } }
    ]);

    for (let i = 0; i < provinces.length; i++) {
      if (province === provinces[i].province_id) {
        province_name = provinces[i].province;
        break;
      }
    }

    for (let i = 0; i < cities.length; i++) {
      if (city === cities[i].city_id) {
        city_name = cities[i].type + " " + cities[i].city_name;
        break;
      }
    }

    // ✅ Safe warehouse ID
    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `WH${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const newWarehouse = new Warehouse({
      id,
      warehouse,
      address,
      province: province_name,
      provinceId: province,
      city: city_name,
      cityId: city,
      main
    });

    await newWarehouse.save();
    res.status(201).json({ message: 'Warehouse created successfully', warehouse: newWarehouse });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ DELETE /warehouse/:id — delete a warehouse
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findOne({ id });
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    // Optional: protect main warehouse
    if (warehouse.main === 0) {
      return res.status(403).json({ error: 'Main warehouse cannot be deleted' });
    }

    await Warehouse.deleteOne({ id });
    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting warehouse:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
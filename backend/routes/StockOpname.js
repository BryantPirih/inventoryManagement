const express = require('express');
const router = express.Router();
const StockOpname = require('../models/stockOpname');
const Product = require('../models/product');
const Worker = require('../models/worker');

// ✅ POST /stockOpname/new — create stock opname & update product
router.post('/new', async (req, res) => {
  try {
    const { data, user } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const currentUser = await Worker.findOne({ username: user });
    if (!currentUser) {
      return res.status(403).json({ error: 'User not found or not authorized' });
    }

    const userRole = currentUser.role; // 1 = admin/owner, 2 = manager, 3 = worker
    const userWarehouseId = currentUser.warehouseId;

    const resultLogs = [];

    for (const item of data) {
      const { id: productId, warehouseId, stock: oldStock, newStock, newReason } = item;

      if (newStock === undefined || newStock === null) continue;

      if (userRole > 1 && warehouseId !== userWarehouseId) {
        console.warn(`❌ Unauthorized opname attempt by ${user} for warehouse ${warehouseId}`);
        continue;
      }

      const difference = newStock - oldStock;

      const newOpname = new StockOpname({
        productId,
        warehouseId,
        oldStock,
        newStock,
        difference,
        reason: newReason || '-',
        updatedBy: user,
        opnameDate: new Date(),
      });

      await newOpname.save();
      resultLogs.push(newOpname);

      await Product.findOneAndUpdate(
        { id: productId, warehouseId },
        {
          $set: {
            stock: newStock,
            lastUpdate: new Date(),
            reason: newReason || '-',
            updatedBy: user,
          },
        }
      );
    }

    res.status(201).json({ message: 'Stock opname recorded', logs: resultLogs });
  } catch (err) {
    console.error('❌ Error in stockOpname/new route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET /stockOpname — get all logs
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;

    let logs;

    if (!username) {
      logs = await StockOpname.find().sort({ opnameDate: -1 });
    } else {
      const user = await Worker.findOne({ username });
      if (!user) return res.status(403).json({ error: 'User not found' });

      if (user.role === 1) {
        logs = await StockOpname.find().sort({ opnameDate: -1 });
      } else {
        logs = await StockOpname.find({ warehouseId: user.warehouseId }).sort({ opnameDate: -1 });
      }
    }

    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const product = await Product.findOne({ id: log.productId });
        return {
          ...log._doc,
          productName: product?.name || "(Produk tidak ditemukan)"
        };
      })
    );

    res.status(200).json({ data: enrichedLogs });
  } catch (err) {
    console.error('❌ Error fetching stock opname logs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET /stockOpname/:warehouseId — get logs by warehouse
router.get('/:warehouseId', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const logs = await StockOpname.find({ warehouseId }).sort({ opnameDate: -1 });
    res.status(200).json({ data: logs });
  } catch (err) {
    console.error('❌ Error fetching warehouse-specific stock opname logs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

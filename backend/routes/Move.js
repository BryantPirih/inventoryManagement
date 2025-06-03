const express = require('express');
const router = express.Router();
const Move = require('../models/move');
const Worker = require('../models/worker');
const Warehouse = require('../models/warehouse');

// ✅ GET all moves
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      const allMoves = await Move.find();
      return res.status(200).json(allMoves);
    }

    const user = await Worker.findOne({ username });
    if (!user) return res.status(403).json({ error: 'User not found' });

    let moves;
    if (user.role === 1) {
      moves = await Move.find(); // admin/owner → see all
    } else {
      moves = await Move.find({ to: user.warehouseId }); // others → only moves sent to their warehouse
    }

    res.status(200).json(moves);
  } catch (err) {
    console.error("❌ Error in GET /move:", err);
    res.status(500).json({ error: 'Failed to fetch moves' });
  }
});


// GET /move/byWarehouse/:username
router.get('/byWarehouseUser/:username', async (req, res) => {
  try {
    const user = await Worker.findOne({ username: req.params.username });
    
    if (!user) return res.status(404).json({ error: 'Worker not found' });

    const warehouse = await Warehouse.findOne({ id: user.warehouseId });
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
    
    let moves;
    
    if (warehouse.main === 0) {
      // Main warehouse → show all
      moves = await Move.find();
    } else {
      // Branch → only see requests from their warehouse
      moves = await Move.find({ to: warehouse.id });
    }
    
    res.status(200).json(moves);
  } catch (err) {
    console.error('Error fetching filtered moves:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ✅ GET single move by ID
router.get('/get/:id', async (req, res) => {
  try {
    const oneMove = await Move.findOne({ id: req.params.id });
    res.status(200).json({ data: oneMove });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch move' });
  }
});

// ✅ POST new move (header only — no product list)
router.post('/new', async (req, res) => {
  try {
    const { requester } = req.body;

    const worker = await Worker.findOne({ username: requester });
    const to = worker.warehouseId;

    const mainWarehouse = await Warehouse.findOne({ main: 0 });
    const from = mainWarehouse.id;

    // ✅ Generate unique ID for move
    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `M${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const newMove = new Move({
      id,
      requester,
      approver: "belum ada",
      from,
      to,
      status: 0
    });

    await newMove.save();
    res.status(201).json({ message: 'Move created successfully', move: newMove });
  } catch (err) {
    console.error('Error creating move:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ PUT update move status
router.put('/updateMove/:id', async (req, res) => {
  try {
    const { updateStatus, approver } = req.body;
    const newStatus = updateStatus + 1;

    const updatePayload = {
      status: newStatus,
      approver
    };

    if (newStatus === 2) {
      updatePayload.moveDate = new Date(); // ✅ set moveDate when status becomes approved
    }

    const updatedMove = await Move.findOneAndUpdate(
      { id: req.params.id },
      { $set: updatePayload },
      { new: true }
    );

    res.status(200).json(updatedMove);
  } catch (err) {
    console.error('Error updating move:', err);
    res.status(500).json({ error: 'Failed to update move' });
  }
});

module.exports = router;

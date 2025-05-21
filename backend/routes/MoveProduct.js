const express = require('express');
const router = express.Router();
const MoveProduct = require('../models/moveProduct');
const Move = require('../models/move');
const Product = require('../models/product');

// ✅ POST /moveProduct/new — Add product list to a move
router.post('/new', async (req, res) => {
  try {
    const { moveId, products } = req.body;

    const newMoveProduct = new MoveProduct({
      moveId,
      products
    });

    await newMoveProduct.save();
    res.status(201).json({ message: 'Move products added successfully', data: newMoveProduct });
  } catch (err) {
    console.error('Error creating moveProduct:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET /moveProduct/:moveId — Get products for a specific move
router.put('/finalize/:moveId', async (req, res) => {
  try {
    const move = await Move.findOne({ id: req.params.moveId });

    if (!move) {
      return res.status(404).json({ error: 'Move not found' });
    }

    if (move.status < 3) {
      return res.status(400).json({ error: 'Move has not arrived yet' });
    }

    if (move.status === 4) {
      return res.status(400).json({ error: 'Move has already been finalized' });
    }

    const moveProduct = await MoveProduct.findOne({ moveId: req.params.moveId });

    if (!moveProduct || !Array.isArray(moveProduct.products) || moveProduct.products.length === 0) {
      return res.status(404).json({ error: 'No products found for this move' });
    }

    const createdProducts = [];

    for (const item of moveProduct.products) {
      console.log(`🔁 Processing productId: ${item.productId}, qty: ${item.quantity}`);

      const existingProduct = await Product.findOne({ id: item.productId, warehouseId: move.to });

      if (existingProduct) {
        existingProduct.stock += item.quantity;
        existingProduct.lastUpdate = new Date();

        await existingProduct.save();
        createdProducts.push(existingProduct);
      } else {
        const sourceProduct = await Product.findOne({ id: item.productId, warehouseId: move.from });

        const newProduct = new Product({
          id: item.productId,
          name: sourceProduct.name,
          stock: item.quantity,
          categoryId: sourceProduct.categoryId,
          unit: sourceProduct.unit,
          unitConversion: sourceProduct.unitConversion, // ✅ fixed typo
          price: sourceProduct.price,
          description: sourceProduct.description, // ✅ always use original
          warehouseId: move.to,
          status: sourceProduct.status,
          lastUpdate: new Date(),
          reason: 'Stock moved',
          updatedBy: move.approver || 'system'
        });


        await newProduct.save();
        createdProducts.push(newProduct);
      }
    }

    // ✅ Finalize only once after all updates
    move.status = 4;
    move.finalizedAt = new Date(); // ← ✅ Add finalized date here
    await move.save();

    res.status(201).json({ message: 'Products moved successfully', products: createdProducts });
  } catch (err) {
    console.error('Error finalizing move:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET /moveProduct/:moveId — fetch products for a move
router.get('/:moveId', async (req, res) => {
  try {
    const moveProduct = await MoveProduct.findOne({ moveId: req.params.moveId });
    if (!moveProduct) {
      return res.status(404).json({ error: 'Move product not found' });
    }

    res.status(200).json({ data: moveProduct });
  } catch (err) {
    console.error('Error fetching moveProduct:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;

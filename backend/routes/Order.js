const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const Warehouse = require('../models/warehouse');

// Get all orders
router.get('/', async (req, res) => {
  try {
    console.log("masuk")
    const orders = await Order.find({ status: { $lt: 4 } }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const orders = await Order.find({ status: { $gte: 4 } }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a new order
router.post('/new', async (req, res) => {
  try {
    const {
      username,
      items,
      paymentMethod,
      deliveryMethod,
      discountCode,
      totalPayment
    } = req.body;

    const status = paymentMethod === 0 ? 1 : 0;
    const orderDate = new Date();

    // Generate unique order ID
    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `O${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    // ✅ Determine warehouseId from worker (based on username)
    const mainWarehouse = await Warehouse.findOne({ main: 0 });
    const warehouseId = mainWarehouse?.id || "WH1"; // fallback just in case

    const newOrder = new Order({
      id,
      username,
      items,
      paymentMethod,
      deliveryMethod,
      orderDate,
      status,
      discountCode,
      totalPayment,
      warehouseId, // ✅ added
      notifiedStatuses: [],
      receivedBy: username,
      deliveredDate: orderDate // optional, matches orderDate
    });

    await newOrder.save();

    // Reduce stock if COD
    if (status === 1) {
      for (const item of items) {
        await Product.updateOne(
          { id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    res.status(201).json({ message: 'order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get order by ID
router.get('/get/:id', async (req, res) => {
  const oneOrder = await Order.findOne({ id: req.params.id });
  res.status(200).json({ data: oneOrder });
});

// Get all orders for a specific user
router.get('/getAllOrderUser/:username', async (req, res) => {
  const orderUser = await Order.find({ username: req.params.username }).sort({ orderDate: -1 });
  res.status(200).json({ data: orderUser });
});

// Update order status manually
router.put('/updateOrder/:id', async (req, res) => {
  const { id } = req.params;
  const { newStatus, receivedBy } = req.body;

  const updateFields = { status: newStatus };

  if (newStatus === 4) {
    updateFields.receivedBy = receivedBy || "Penerima tidak diketahui";
    updateFields.deliveredDate = new Date();
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ New endpoint: update status after Midtrans payment success
router.put('/updateStatusAfterPayment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch full order first
    const order = await Order.findOne({ id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only update if not already confirmed
    if (order.status !== 1) {
      // 🔻 Deduct stock for each item
      for (const item of order.items) {
        await Product.updateOne(
          { id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }

      // Update status
      order.status = 1;
      await order.save();
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating status after payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

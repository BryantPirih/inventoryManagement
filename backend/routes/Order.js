const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const Warehouse = require('../models/warehouse');

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

    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `O${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;

    const mainWarehouse = await Warehouse.findOne({ main: 0 });
    const warehouseId = mainWarehouse?.id || "WH1";

    const enrichedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findOne({ id: item.productId });
      const price = product?.price || 0;
      const quantity = parseInt(item.quantity);
      return {
        productId: item.productId,
        productName: item.productName,
        quantity,
        price,
        total: price * quantity
      };
    }));

    const newOrder = new Order({
      id,
      username,
      items: enrichedItems,
      paymentMethod,
      deliveryMethod,
      orderDate,
      status,
      discountCode,
      totalPayment,
      warehouseId,
      notifiedStatuses: [],
      receivedBy: username,
      deliveredDate: orderDate,
      deliveryId: null  
    });

    await newOrder.save();

    if (status === 1) {
      for (const item of enrichedItems) {
        await Product.updateOne(
          { id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { deliveryId } = req.body;

  try {
    const updated = await Order.findOneAndUpdate(
      { id },
      { $set: { deliveryId } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Delivery ID added", order: updated });
  } catch (err) {
    console.error("Error updating order with deliveryId:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/get/:id', async (req, res) => {
  const oneOrder = await Order.findOne({ id: req.params.id });
  res.status(200).json({ data: oneOrder });
});

router.get('/getAllOrderUser/:username', async (req, res) => {
  const orderUser = await Order.find({ username: req.params.username }).sort({ orderDate: -1 });
  res.status(200).json({ data: orderUser });
});

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

router.put('/updateStatusAfterPayment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 1) {
      for (const item of order.items) {
        await Product.updateOne(
          { id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }

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

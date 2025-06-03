const Midtrans = require('midtrans-client');
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
require('dotenv').config();

const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});

router.post('/createTransaction', async (req, res) => {
    const { order_id, gross_amount, customer_details } = req.body;
    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      customer_details: customer_details,
    };
  
    try {
      const transaction = await snap.createTransaction(parameter);
      res.status(200).json({ 
        token: transaction.token,
        redirect_url: transaction.redirect_url
      });
    } catch (error) {
      console.error('Midtrans error:', error);
      res.status(500).json({ error: 'Transaction creation failed' });
    }

});

router.get('/charge/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ id: orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: order.totalPayment,
      },
      credit_card: {
        secure: true
      }
    };

    const transaction = await snap.createTransaction(parameter);
    return res.json({ token: transaction.token });
  } catch (err) {
    console.error("Midtrans charge error:", err);
    res.status(500).json({ message: "Failed to generate Snap token" });
  }
});

router.post('/notification', async (req, res) => {
  try {
    const core = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    const statusResponse = await core.transaction.notification(req.body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let newStatus = 0; 
    if (transactionStatus === 'capture' && fraudStatus === 'accept') {
      newStatus = 1;
    } else if (transactionStatus === 'settlement') {
      newStatus = 1;
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      newStatus = 2;
    }
    
    await Order.findOneAndUpdate({ id: orderId }, { status: newStatus });

    res.status(200).json({ message: 'Notification received' });
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ error: 'Notification failed' });
  }
});


module.exports = router;
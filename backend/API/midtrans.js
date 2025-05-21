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
      res.status(200).json({ token: transaction.token });
    } catch (error) {
      console.error('Midtrans error:', error);
      res.status(500).json({ error: 'Transaction creation failed' });
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
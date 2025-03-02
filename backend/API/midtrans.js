const Midtrans = require('midtrans-client');
const express = require('express');
const router = express.Router();
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

module.exports = router;
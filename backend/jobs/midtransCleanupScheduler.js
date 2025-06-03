const cron = require('node-cron');
const Order = require('../models/order');
const Product = require('../models/product');

function runMidtransCleanup() {
  
 cron.schedule('*/15 * * * *', async () => {
    console.log('Running unpaid Midtrans order cleanup...');

    const expiredTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        const expiredOrders = await Order.find({
        status: 0,
        orderDate: { $lt: expiredTime }
        });

        for (const order of expiredOrders) {
        console.log(`Deleting unpaid order: ${order.id}`);
        await Order.deleteOne({ id: order.id });
        }

        if (expiredOrders.length === 0) {
        console.log('No expired unpaid orders found.');
        }
    } catch (err) {
        console.error('Error cleaning unpaid orders:', err);
    }
    });
}

module.exports = runMidtransCleanup;

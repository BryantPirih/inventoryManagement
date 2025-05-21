const cron = require('node-cron');
const Reminder = require('../models/reminder');
const Worker = require('../models/worker');
const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const Order = require('../models/order');
const Notification = require('../models/notification');
const sendEmail = require('../utils/sendEmail');
const runMonthlyInventoryReminder = require('./inventoryCheckScheduler');
const runLowStockReminder = require('./lowStockReminderScheduler');

const runReminderScheduler = () => {
  // 🔁 General reminder scheduler
  cron.schedule('* * * * *', async () => {
    console.log('🔔 Running reminder check...');
    try {
      const now = new Date();
      const reminders = await Reminder.find({ isSent: false, remindAt: { $lte: now } });
      const managers = await Worker.find({ role: 2 });

      for (const reminder of reminders) {
        for (const manager of managers) {
          await sendEmail({
            to: manager.email,
            subject: `Reminder: ${reminder.title}`,
            text: reminder.message
          });
        }

        reminder.isSent = true;
        await reminder.save();
        console.log(`✅ Reminder "${reminder.title}" sent and marked as sent`);
      }
    } catch (error) {
      console.error('📛 Reminder scheduler error:', error);
    }
  });
  
  // 🛒 Wishlist restock checker (runs every hour)
cron.schedule('* * * * *', async () => {
  console.log('🔍 Checking wishlist restocks...');

  try {
    const wishlists = await Wishlist.find();

    for (const wishlist of wishlists) {
      let updated = false;

      for (const item of wishlist.items) {
        if (item.status === 'out-of-stock' && !item.notified) {
          const product = await Product.findOne({ id: item.productID });

          if (product && product.stock > 0) {
            // ✅ Mark item as restocked and notify
            item.status = 'in-stock';
            item.notified = true;
            updated = true;

            console.log(`📢 Notify ${wishlist.username}: "${item.productName}" now in stock`);
            // TODO: Replace this console.log with in-app notification or email if needed
            await Notification.create({
              username: wishlist.username,
              type: 'wishlist',
              title: 'Wishlist Restock Alert',
              message: `"${item.productName}" is now back in stock!`
            });

          }
        }
      }
      if (updated) {
        await wishlist.save();
        console.log(`✅ Wishlist for ${wishlist.username} updated`);
      }
    }
  } catch (err) {
    console.error('📛 Wishlist restock check error:', err);
  }
});

// 🚚 Order status notifier (every 2 minutes for demo)
cron.schedule('*/2 * * * *', async () => {
  console.log('📦 Checking orders for status notifications...');

  try {
    const orders = await Order.find();

    for (const order of orders) {
      // Skip if already notified for this status
      if (order.notifiedStatuses?.includes(order.status)) continue;

      let notificationData = null;

      switch (order.status) {
        case 1:
          notificationData = {
            type: 'payment',
            title: 'Pembayaran Diterima',
            message: `Pembayaran untuk pesanan ${order.id} telah diterima.`
          };
          break;
        case 2:
          notificationData = {
            type: 'process',
            title: 'Pesanan Diproses',
            message: `Pesanan ${order.id} sedang diproses oleh penjual.`
          };
          break;
        case 3:
          notificationData = {
            type: 'shipping',
            title: 'Pesanan Dikirim',
            message: `Pesanan ${order.id} sedang dalam perjalanan.`
          };
          break;
        case 4:
          notificationData = {
            type: 'delivered',
            title: 'Pesanan Telah Diterima',
            message: `Pesanan ${order.id} telah diterima. Anda bisa mengajukan retur jika diperlukan.`
          };
          break;
        case 5:
          notificationData = {
            type: 'complete',
            title: 'Pesanan Selesai',
            message: `Pesanan ${order.id} telah selesai. Terima kasih telah berbelanja.`
          };
          break;
        default:
          break;
      }

      if (notificationData) {
        await Notification.create({
          username: order.username,
          ...notificationData
        });

        order.notifiedStatuses = order.notifiedStatuses || [];
        order.notifiedStatuses.push(order.status);
        await order.save();

        console.log(`🔔 Notification sent for order ${order.id}, status ${order.status}`);
      }
    }
  } catch (err) {
    console.error('📛 Order status notification error:', err);
  }
});

cron.schedule('0 2 * * *', async () => {
  console.log('Running auto-finish order check...');

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  try {
    const result = await Order.updateMany(
      {
        status: 4,
        deliveredDate: { $lte: threeDaysAgo }
      },
      {
        $set: { status: 5 }
      }
    );

    console.log(`Auto-completed ${result.modifiedCount} orders.`);
  } catch (error) {
    console.error('Error auto-finishing orders:', error);
  }
});




  // 📅 Start monthly and low stock reminder jobs
  runMonthlyInventoryReminder();
  runLowStockReminder();
};

module.exports = runReminderScheduler;

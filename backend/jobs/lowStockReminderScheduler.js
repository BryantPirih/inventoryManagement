const cron = require('node-cron');
const sendEmail = require('../utils/sendEmail');
const Worker = require('../models/worker');
const Product = require('../models/product');

function runLowStockReminder() {
  cron.schedule('0 8 * * *', async () => {
    console.log('🔍 Running low stock reminder...');

    try {
      const lowStockItems = await Product.find({ stock: { $lt: 10 } });
      if (lowStockItems.length === 0) return;

      const warehouseMap = {}; 

      for (let item of lowStockItems) {
        const warehouseId = item.warehouseId?.toString();
        if (!warehouseId) {
          continue;
        }

        if (!warehouseMap[warehouseId]) {
          warehouseMap[warehouseId] = [];
        }

        warehouseMap[warehouseId].push(item);
      }

      console.log('🗺️ Grouped items by warehouse:');
      for (const [wid, items] of Object.entries(warehouseMap)) {
        items.forEach(i => console.log(`   - ${i.name}: ${i.stock}`));
      }

      for (let warehouseId in warehouseMap) {
        const managers = await Worker.find({ role: 2, warehouseId });

        const products = warehouseMap[warehouseId];
        const message = products.map(p => `- ${p.name}: ${p.stock} left`).join('\n');

        for (let manager of managers) {
          await sendEmail({
            to: manager.email,
            subject: 'Low Stock Alert - Warehouse',
            text: `The following items are low on stock in your warehouse:\n\n${message}`
          });
        }
      }

    } catch (err) {
      console.error('📛 Low stock reminder error:', err);
    }
  });
}

module.exports = runLowStockReminder;

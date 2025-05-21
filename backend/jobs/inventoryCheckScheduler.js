const cron = require('node-cron');
const sendEmail = require('../utils/sendEmail');
const Worker = require('../models/worker');

function runMonthlyInventoryReminder() {
  cron.schedule('0 0 1 * *', async () => {
    console.log('📅 Running monthly inventory check reminder...');
    try {
      const managers = await Worker.find({ role: 2 });
      for (let manager of managers) {
        await sendEmail({
          to: manager.email,
          subject: 'Monthly Inventory Check Reminder',
          text: 'Reminder: Please perform the monthly inventory check today.'
        });
      }
    } catch (err) {
      console.error('📛 Reminder email error:', err);
    }
  });
}

module.exports = runMonthlyInventoryReminder;

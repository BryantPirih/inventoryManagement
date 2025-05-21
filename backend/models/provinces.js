const mongoose = require('mongoose');

const provincesSchema = new mongoose.Schema({
  province: [
    {
      province_id: String,
      province: String,
    }
  ]
});

module.exports = mongoose.model('provinces', provincesSchema);
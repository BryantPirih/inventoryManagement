const mongoose = require('mongoose');

const citiesSchema = new mongoose.Schema({
  city: [
    {
      city_id: String,
      province_id: String,
      province: String,
      type: String,
      city_name: String,
      postal_code: String
    }
  ]
});

module.exports = mongoose.model('cities', citiesSchema);
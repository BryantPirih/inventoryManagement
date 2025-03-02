const mongoose = require('mongoose');

const warehouseSchemas = new mongoose.Schema({
    id: String,
    warehouse: String,
    address: String,
    province: String,
    provinceId: String,
    city: String,
    cityId: String,
    main: Number
});

module.exports = mongoose.model('warehouse', warehouseSchemas);
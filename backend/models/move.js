const mongoose = require('mongoose');

const moveSchemas = new mongoose.Schema({
    id : String,
    requester: String,
    approver : String,
    from : String,
    to : String,
    status: Number
});

module.exports = mongoose.model('move', moveSchemas);
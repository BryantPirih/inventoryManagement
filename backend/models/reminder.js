const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String },
    remindAt: { type: Date, required: true },
    isSent: { type: Boolean, default: false }, 
    createdBy: { type: String }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reminder", reminderSchema);
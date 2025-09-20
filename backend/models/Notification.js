const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: String,
  type: { type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);


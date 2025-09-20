const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'staff', 'citizen', 'manager'], default: 'citizen' },
  phone: String,
  assignedArea: String,
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  assignedRoute: String
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
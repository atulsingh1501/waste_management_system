const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedVehicles: [String],
  assignedStaff: [String],
  areas: [String],
  coordinates: [{ lat: Number, lng: Number }]
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
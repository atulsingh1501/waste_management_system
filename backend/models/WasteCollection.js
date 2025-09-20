const mongoose = require('mongoose');

const wasteCollectionSchema = new mongoose.Schema({
  area: { type: String, required: true },
  route: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'missed'], default: 'pending' },
  assignedStaff: String,
  vehicleId: String,
  wasteType: { type: String, enum: ['solid', 'recyclable', 'compost'], required: true },
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('WasteCollection', wasteCollectionSchema);
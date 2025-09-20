const mongoose = require('mongoose');

const citizenReportSchema = new mongoose.Schema({
  citizenId: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['received', 'in-progress', 'resolved'], default: 'received' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  reportedAt: { type: Date, default: Date.now },
  coordinates: {
    lat: Number,
    lng: Number
  },
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('CitizenReport', citizenReportSchema);
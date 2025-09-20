const mongoose = require('mongoose');

const binStatusSchema = new mongoose.Schema({
  location: { type: String, required: true },
  status: { type: String, enum: ['empty', 'half-full', 'full', 'overflowing'], default: 'empty' },
  lastUpdated: { type: Date, default: Date.now },
  coordinates: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('BinStatus', binStatusSchema);
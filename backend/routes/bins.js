const express = require('express');
const BinStatus = require('../models/BinStatus');
const router = express.Router();

// Get all bins
router.get('/', async (req, res) => {
  try {
    const bins = await BinStatus.find();
    res.json(bins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new bin status
router.post('/', async (req, res) => {
  try {
    const bin = new BinStatus(req.body);
    await bin.save();
    res.status(201).json(bin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get bin by ID
router.get('/:id', async (req, res) => {
  try {
    const bin = await BinStatus.findById(req.params.id);
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    res.json(bin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update bin status
router.put('/:id', async (req, res) => {
  try {
    const bin = await BinStatus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    res.json(bin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete bin status
router.delete('/:id', async (req, res) => {
  try {
    const bin = await BinStatus.findByIdAndDelete(req.params.id);
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    res.json({ message: 'Bin deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

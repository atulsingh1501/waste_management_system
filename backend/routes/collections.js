const express = require('express');
const WasteCollection = require('../models/WasteCollection');
const router = express.Router();

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await WasteCollection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new collection
router.post('/', async (req, res) => {
  try {
    const collection = new WasteCollection(req.body);
    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get collection by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await WasteCollection.findById(req.params.id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update collection
router.put('/:id', async (req, res) => {
  try {
    const collection = await WasteCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete collection
router.delete('/:id', async (req, res) => {
  try {
    const collection = await WasteCollection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

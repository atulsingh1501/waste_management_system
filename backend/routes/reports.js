const express = require('express');
const CitizenReport = require('../models/CitizenReport');
const router = express.Router();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await CitizenReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new report
router.post('/', async (req, res) => {
  try {
    const report = new CitizenReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await CitizenReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update report
router.put('/:id', async (req, res) => {
  try {
    const report = await CitizenReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    const report = await CitizenReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

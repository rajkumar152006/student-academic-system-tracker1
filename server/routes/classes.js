const express = require('express');
const router = express.Router();
const ClassData = require('../models/Class');
const verifyToken = require('../middleware/auth');

// Get all
router.get('/', verifyToken, async (req, res) => {
  try {
    const records = await ClassData.find().populate('classTeacher').populate('students').populate('timetable.monday.course');
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get single
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const record = await ClassData.findById(req.params.id).populate('classTeacher').populate('students');
    if (!record) return res.status(404).json({ msg: 'Not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create
router.post('/', verifyToken, async (req, res) => {
  try {
    const newRecord = new ClassData(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Update
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await ClassData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await ClassData.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

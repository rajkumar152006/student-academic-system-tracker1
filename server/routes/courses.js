const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const verifyToken = require('../middleware/auth');

// Get all
router.get('/', verifyToken, async (req, res) => {
  try {
    const records = await Course.find().populate('teacher').populate('enrolledStudents');
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get single
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const record = await Course.findById(req.params.id).populate('teacher').populate('enrolledStudents');
    if (!record) return res.status(404).json({ msg: 'Not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create
router.post('/', verifyToken, async (req, res) => {
  try {
    const newRecord = new Course(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Update
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

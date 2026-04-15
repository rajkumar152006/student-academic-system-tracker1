const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const verifyToken = require('../middleware/auth');

// Get all teachers
router.get('/', verifyToken, async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('subjectsTaught').populate('assignedClasses');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get single teacher
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('subjectsTaught').populate('assignedClasses');
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create new teacher
router.post('/', async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Update teacher
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete teacher
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

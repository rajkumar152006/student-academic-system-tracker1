const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

// Login with auto-registration on first login
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({ error: 'Roll number and password required' });
    }

    // Check if student exists
    let student = await Student.findOne({ rollNumber });

    if (!student) {
      // Auto-register: Create new student on first login
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      student = new Student({
        rollNumber,
        password: hashedPassword,
        name: `Student ${rollNumber}`,
        department: 'CSE',
        year: 1,
        attendance: 0,
        email: `${rollNumber}@student.edu`,
        feesDue: 0,
        arrearCount: 0,
        sgpa: 0,
        cgpa: 0,
        achievements: {
          projects: 0,
          courses: 0,
          papers: 0,
          internships: 0,
          placement: {
            companiesAttended: 0,
            placementPercentage: 0,
            assessment: ''
          }
        }
      });
      await student.save();
      const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'Account created successfully', student, token });
    }

    // Student exists: Verify password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ ...student.toObject(), token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
router.post('/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, you would verify against a User/Admin model.
    if (email === 'admin@school.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin-id', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({
        email: email,
        role: 'admin',
        token,
        loginTime: new Date().toISOString()
      });
    }

    return res.status(401).json({ error: 'Invalid admin credentials' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teacher Login
router.post('/teacher/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    let teacher = await Teacher.findOne({ email });

    if (!teacher) {
      teacher = new Teacher({
        email,
        password,
        name: `Faculty ${email.split('@')[0]}`,
        employeeId: `TCH-${Math.floor(Math.random() * 10000)}`,
        department: 'General'
      });
      await teacher.save();
    } else if (teacher.password !== password) {
      return res.status(401).json({ error: 'Invalid faculty credentials' });
    }

    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ ...teacher.toObject(), token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

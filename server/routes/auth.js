const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

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
      student = new Student({
        rollNumber,
        password,
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
      return res.json({ message: 'Account created successfully', student });
    }

    // Student exists: Verify password
    if (student.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    return res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

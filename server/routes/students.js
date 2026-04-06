const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({}, 'name rollNumber department year');
    res.json(students);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// POST add achievement item (projectsList / internshipsList / hackathonsList / papersList / coursesList)
router.post('/:id/achievements', async (req, res) => {
  try {
    const { type, item } = req.body; // type: 'projects'|'internships'|'hackathons'|'papers'|'courses'
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    if (type === 'projects') {
      student.projectsList = student.projectsList || [];
      student.projectsList.push(item);
      student.achievements.projects = (student.achievements.projects || 0) + 1;
    } else if (type === 'internships') {
      student.internshipsList = student.internshipsList || [];
      student.internshipsList.push(item);
      student.achievements.internships = (student.achievements.internships || 0) + 1;
    } else if (type === 'hackathons') {
      student.hackathonsList = student.hackathonsList || [];
      student.hackathonsList.push(item);
    } else if (type === 'papers') {
      student.papersList = student.papersList || [];
      student.papersList.push(item);
      student.achievements.papers = (student.achievements.papers || 0) + 1;
    } else if (type === 'courses') {
      student.coursesList = student.coursesList || [];
      student.coursesList.push(item);
      student.achievements.courses = (student.achievements.courses || 0) + 1;
    } else {
      return res.status(400).json({ msg: 'Invalid achievement type' });
    }

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET notification count (pending submissions)
router.get('/notifications/count', async (req, res) => {
  try {
    const students = await Student.find({});
    let totalPending = 0;
    students.forEach(s => {
      totalPending += (s.projectsList || []).filter(p => p.status === 'pending').length;
      totalPending += (s.internshipsList || []).filter(p => p.status === 'pending').length;
      totalPending += (s.hackathonsList || []).filter(p => p.status === 'pending').length;
      totalPending += (s.papersList || []).filter(p => p.status === 'pending').length;
      totalPending += (s.coursesList || []).filter(p => p.status === 'pending').length;
    });
    res.json({ count: totalPending });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching notifications', error: err.message });
  }
});

// GET all pending notifications (detailed list)
router.get('/notifications/list', async (req, res) => {
  try {
    const students = await Student.find({}, 'name rollNumber projectsList internshipsList hackathonsList papersList coursesList');
    const notifications = [];
    
    students.forEach(s => {
      const types = [
        { key: 'projectsList', label: 'Project' },
        { key: 'internshipsList', label: 'Internship' },
        { key: 'hackathonsList', label: 'Hackathon' },
        { key: 'papersList', label: 'Paper' },
        { key: 'coursesList', label: 'Course' }
      ];

      types.forEach(({ key, label }) => {
        (s[key] || []).forEach((item, idx) => {
          if (item.status === 'pending') {
            notifications.push({
              studentId: s._id,
              rollNumber: s.rollNumber,
              studentName: s.name,
              submissionType: label,
              title: item.name,
              date: item.date,
              listName: key,
              itemIndex: idx
            });
          }
        });
      });
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching notification list', error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;

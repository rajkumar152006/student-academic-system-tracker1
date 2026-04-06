require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_academic';

async function run() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB for seeding');

    const roll = '21CSE101';
    const payload = {
      name: 'Raj Kumar',
      rollNumber: roll,
      password: 'password123',
      department: 'CSE',
      year: 3,
      attendance: 85,
      email: 'raj.kumar@example.com',
      feesDue: 15000,
      arrearCount: 1,
      sgpa: 8.2,
      cgpa: 7.9,
      achievements: {
        projects: 2,
        courses: 3,
        papers: 1,
        internships: 1,
        placement: {
          companiesAttended: 4,
          placementPercentage: 60,
          assessment: 'Good fit for frontend roles'
        }
      },
      subjects: [
        { name: 'Algorithms', marks: 85, internal: 20 },
        { name: 'DBMS', marks: 78, internal: 18 }
      ]
    };

    const doc = await Student.findOneAndUpdate({ rollNumber: roll }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log('✅ Seeded student:', doc.rollNumber, doc.name);
  } catch (err) {
    console.error('❌ Seed failed:', err.message || err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();

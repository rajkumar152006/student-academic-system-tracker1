require('dotenv').config();
const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/student_academic';
const REMOTE_URI = 'mongodb+srv://rajravirk15_db_user:zs3Co89Q4wGYSVBN@cluster0.zdbmywm.mongodb.net/student-tracker?appName=Cluster0';

const Student = require('./models/Student');

async function migrate() {
  try {
    const localDb = await mongoose.createConnection(LOCAL_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Local DB');
    const LocalStudent = localDb.model('Student', Student.schema);
    const students = await LocalStudent.find({});
    console.log(`Found ${students.length} students in local DB`);

    const remoteDb = await mongoose.createConnection(REMOTE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Remote DB');
    const RemoteStudent = remoteDb.model('Student', Student.schema);

    for (const s of students) {
      const doc = s.toObject();
      delete doc._id;
      delete doc.__v;
      await RemoteStudent.findOneAndUpdate(
        { rollNumber: doc.rollNumber },
        doc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Migrated student: ${doc.rollNumber}`);
    }

    console.log('Data migration complete. Now running seed.js data...');
    // Seed sample data
    const payload = {
      name: 'Raj Kumar',
      rollNumber: '21CSE101',
      password: 'password123',
      department: 'CSE',
      year: 3,
      attendance: 85,
      email: 'raj.kumar@example.com',
      feesDue: 15000,
      arrearCount: 1,
      sgpa: 8.2,
      cgpa: 7.9,
      achievements: { projects: 2, courses: 3, papers: 1, internships: 1, placement: { companiesAttended: 4, placementPercentage: 60, assessment: 'Good fit for frontend roles' } },
      subjects: [ { name: 'Algorithms', marks: 85, internal: 20 }, { name: 'DBMS', marks: 78, internal: 18 } ]
    };
    await RemoteStudent.findOneAndUpdate({ rollNumber: payload.rollNumber }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log('✅ Seeded student: 21CSE101 Raj Kumar');

    console.log('Migration and seeding successful.');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
migrate();

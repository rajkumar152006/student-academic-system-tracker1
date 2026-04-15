const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: String,
  marks: Number,
  internal: Number,
});

const LabCourseSchema = new mongoose.Schema({
  name: String,
  marks: Number,
  experimentsCompleted: Number,
  experimentsPending: Number,
}, { _id: false });

const AssignmentSchema = new mongoose.Schema({
  name: String,
  marks: Number,
  completed: Number,
  pending: Number,
}, { _id: false });

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: String,
  year: Number,
  parentDetails: {
    fatherName: String,
    motherName: String,
    contactNumber: String,
    email: String,
  },
  behaviorLogs: [{
    date: Date,
    incident: String,
    type: { type: String, enum: ['positive', 'negative', 'neutral'] },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  }],
  attendanceLog: [{
    date: Date,
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'] }
  }],
  attendance: { type: Number, default: 0 },
  email: { type: String },
  feesDue: { type: Number, default: 0 },
  arrearCount: { type: Number, default: 0 },
  subjects: [SubjectSchema],
  labCourses: { type: [LabCourseSchema], default: [] },
  assignments: { type: [AssignmentSchema], default: [] },
  sgpa: { type: Number, default: 0 },
  cgpa: { type: Number, default: 0 },
  achievements: {
    projects: { type: Number, default: 0 },
    courses: { type: Number, default: 0 },
    papers: { type: Number, default: 0 },
    internships: { type: Number, default: 0 },
    placement: {
      companiesAttended: { type: Number, default: 0 },
      placementPercentage: { type: Number, default: 0 },
      assessment: { type: String, default: '' },
    },
  },
  // Detailed lists for achievements with proof and admin approval
  projectsList: [{
    name: String,
    description: String,
    date: String,
    proof: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    marks: { type: Number, default: 0 },
    remarks: { type: String, default: '' }
  }],
  internshipsList: [{
    name: String,
    role: String,
    date: String,
    proof: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    marks: { type: Number, default: 0 },
    remarks: { type: String, default: '' }
  }],
  hackathonsList: [{
    name: String,
    description: String,
    date: String,
    proof: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    marks: { type: Number, default: 0 },
    remarks: { type: String, default: '' }
  }],
  papersList: [{
    name: String,
    conference: String,
    date: String,
    proof: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    marks: { type: Number, default: 0 },
    remarks: { type: String, default: '' }
  }],
  coursesList: [{
    name: String,
    platform: String,
    date: String,
    proof: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    marks: { type: Number, default: 0 },
    remarks: { type: String, default: '' }
  }],
});

module.exports = mongoose.model('Student', StudentSchema);

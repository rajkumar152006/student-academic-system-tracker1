const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  dateJoined: { type: Date, default: Date.now },
  role: { type: String, default: 'teacher' },
  subjectsTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  payroll: {
    baseSalary: { type: Number, default: 0 },
    status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
    lastPaid: { type: Date }
  },
  attendance: [{ date: Date, status: { type: String, enum: ['present', 'absent', 'leave'] } }]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);

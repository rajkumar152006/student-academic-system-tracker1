const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  department: { type: String, required: true },
  credits: { type: Number, default: 3 },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  term: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);

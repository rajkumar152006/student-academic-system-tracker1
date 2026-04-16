const mongoose = require('mongoose');

const TimetableSlotSchema = new mongoose.Schema({
  period: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "BTech-CS-A" or "Grade 10 - A"
  department: { type: String, required: true },
  year: { type: Number, required: true },
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  timetable: {
    monday: [TimetableSlotSchema],
    tuesday: [TimetableSlotSchema],
    wednesday: [TimetableSlotSchema],
    thursday: [TimetableSlotSchema],
    friday: [TimetableSlotSchema],
    saturday: [TimetableSlotSchema]
  }
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);

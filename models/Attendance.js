// const mongoose = require('mongoose');

// const AttendanceSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   professor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['present', 'absent'],
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Attendance', AttendanceSchema);


// ---------------------------------------------------------------------------------

const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
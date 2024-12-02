// const mongoose = require('mongoose');

// const MarkSchema = new mongoose.Schema({
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
//   marks: {
//     type: Number,
//     required: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Mark', MarkSchema);


// --------------------------------------------------------------

const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
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
  internalExam1: {
    type: Number,
  },
  internalExam2: {
    type: Number,
  },
  subject: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Mark', MarkSchema);
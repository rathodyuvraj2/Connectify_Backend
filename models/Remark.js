// const mongoose = require('mongoose');

// const RemarkSchema = new mongoose.Schema({
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
//   text: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Remark', RemarkSchema);

// ----------------------------------------------------

// const mongoose = require('mongoose');

// const RemarkSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   text: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Remark', RemarkSchema);

// -----------------------------------------------------

const mongoose = require('mongoose');

const RemarkSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Remark', RemarkSchema);
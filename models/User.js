// // backend/models/User.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const UserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   studentId: { type: String },
//   role: { type: String, enum: ['student', 'professor', 'proctor', 'clubLead', 'admin'], required: true },
//   password: { type: String, required: true },
// });

// // Hash password before saving
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Password comparison
// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);

// -----------------------------------------------------

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const UserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   studentId: { type: String, required: function() { return this.role === 'student'; } },
//   semester: { type: String },
//   role: { type: String, enum: ['student', 'professor', 'proctor', 'clubLead', 'admin'], required: true },
//   password: { type: String},
// });// Hash password before saving
// // UserSchema.pre('save', async function (next) {
// //   if (!this.isModified('password')) return next();
// //   this.password = await bcrypt.hash(this.password, 10);
// //   next();
// // });

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   if (this.role === 'student') {
//     this.password = await bcrypt.hash(this.studentId, 10);
//   } else {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// // Password comparison
// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);

// -----------------------------------------------------------

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const UserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   studentId: { type: String, required: true },
//   semester: { type: String, required: true },
//   password: { type: String, required: true },
//   department: { type: String, required: true },
//   batch: { type: String, required: true },
//   phoneNumber: { type: String },
//   dateOfBirth: { type: Date },
//   address: { type: String },
//   gender: { type: String, enum: ['male', 'female', 'other'] },
//   profilePicture: { type: String },
//   cgpa: { type: Number },
//   enrollmentDate: { type: Date },
//   skills: [{ type: String }],
//   extracurricularActivities: [{ type: String }],
//   achievements: [{ type: String }],
//   certifications: [{
//     name: { type: String },
//     issuer: { type: String },
//     date: { type: Date },
//     expiryDate: { type: Date },
//     credentialUrl: { type: String }
//   }],
//   projects: [{
//     title: { type: String },
//     description: { type: String },
//     startDate: { type: Date },
//     endDate: { type: Date },
//     technologies: [{ type: String }],
//     projectUrl: { type: String },
//     githubUrl: { type: String }
//   }]
// });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  role: { type: String, default: 'student' },
  isClubLead: { type: Boolean, default: false },
  clubLeadDetails: {
    club: { type: String },
    position: { type: String },
    since: { type: Date }
  },
  batch: { type: String, required: true },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  profilePicture: { type: String },
  cgpa: { type: Number },
  enrollmentDate: { type: Date, default: Date.now },
  skills: [{ type: String }],
  achievements: [{ type: String }],
  certifications: [{
    name: { type: String },
    issuer: { type: String },
    date: { type: Date },
    credentialUrl: { type: String }
  }],
  projects: [{
    title: { type: String },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    technologies: [{ type: String }],
    projectUrl: { type: String },
    githubUrl: { type: String }
  }]
});


// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.studentId, 10);
  next();
});

// Password comparison
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const FacultySchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   role: { type: String, enum: ['professor', 'proctor'], required: true },
//   password: { type: String, required: true },
// });

// // Hash password before saving
// FacultySchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Password comparison
// FacultySchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('Faculty', FacultySchema);

// ---------------------------------------------------

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const FacultySchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   role: { type: String, enum: ['professor', 'proctor'], required: true },
//   password: { type: String, required: true },
// });

// // Hash password before saving
// FacultySchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Password comparison
// FacultySchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Virtual field for remarks
// FacultySchema.virtual('remarks', {
//   ref: 'Remark',
//   localField: '_id',
//   foreignField: 'faculty',
//   justOne: false
// });

// module.exports = mongoose.model('Faculty', FacultySchema);

// ---------------------------------------------------

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const FacultySchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   role: { type: String, enum: ['professor', 'proctor'], required: true },
//   password: { type: String, required: true, default: '123' },
//   department: { type: String, required: true },
//   employeeId: { type: String, required: true, unique: true },
//   phoneNumber: { type: String, required: true },
//   designation: { type: String, required: true },
//   joiningDate: { type: Date, default: Date.now },
//   isActive: { type: Boolean, default: true },
//   profileImage: { type: String },
//   officeLocation: { type: String },
//   officeHours: { type: String },
//   specialization: [String],
//   qualifications: [{
//     degree: { type: String },
//     institution: { type: String },
//     year: { type: Number }
//   }],
//   lastLogin: { type: Date }
// });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const FacultySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: 'professor' },
  isProctor: { type: Boolean, default: false },
  proctorDetails: {
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    department: { type: String },
    since: { type: Date }
  },
  employeeId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  designation: { type: String, required: true },
  officeLocation: { type: String },
  officeHours: { type: String },
  joiningDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String },
  specialization: [String],
  qualifications: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: Number }
  }]
});


// Hash password before saving
FacultySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison
FacultySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual field for remarks
FacultySchema.virtual('remarks', {
  ref: 'Remark',
  localField: '_id',
  foreignField: 'faculty',
  justOne: false
});

FacultySchema.set('toObject', { virtuals: true });
FacultySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Faculty', FacultySchema);
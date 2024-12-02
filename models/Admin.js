const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], required: true }
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create default admin on server start
AdminSchema.statics.createDefaultAdmin = async function() {
  try {
    const adminExists = await this.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const defaultAdmin = new this({
        fullName: 'Default Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role : 'admin'
      });
      await defaultAdmin.save();
      console.log('Default admin created successfully');
    }
    else{
      console.log("Admin already exists");
    }
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin already exists');
    } else {
      console.error('Error creating default admin:', error);
    }
  }
};

const Admin = mongoose.model('Admin', AdminSchema);

// Call createDefaultAdmin when the model is initialized
Admin.createDefaultAdmin();

module.exports = Admin;
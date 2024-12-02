const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  expiryDate: Date,
  credentialId: String,
  credentialUrl: String,
  description: String,
  skills: [String],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  projectType: {
    type: String,
    enum: ['academic', 'personal', 'internship', 'opensource'],
    required: true
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'archived'],
    default: 'ongoing'
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

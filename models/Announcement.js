const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty', 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  authorRole: { 
    type: String, 
    required: true,
    enum: ['proctor']
  },
  authorName: { 
    type: String, 
    required: true 
  }
});
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
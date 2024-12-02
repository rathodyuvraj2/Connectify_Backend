const mongoose = require('mongoose');

// Group Message Schema
const groupMessageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);

module.exports = GroupMessage;
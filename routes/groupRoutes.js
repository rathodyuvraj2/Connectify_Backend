const express = require('express');
const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/",async(req,res)=>{
    try {
        const groups = await Group.find({});
        console.log("groups data: " ,groups);
        res.json({groups});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

// Create group (restricted to club leads)
router.post('/', authenticateJWT, async (req, res) => {
  const { userId, name } = req.body;
  try {
    const user = await User.findById(userId);
    if (user && user.role === 'clubLead') {
      const group = new Group({
        name,
        createdBy: userId,
      });
      await group.save();
      res.status(201).json({ success: true, data: group });
    } else {
      res.status(403).json({ success: false, message: 'Only club leads can create groups' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch group messages
router.get('/:groupId/messages', authenticateJWT, async (req, res) => {
    try {
      const messages = await GroupMessage.find({ groupId: req.params.groupId }).sort({ timestamp: 1 });
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
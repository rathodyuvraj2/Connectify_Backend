const express = require('express');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/authMiddleware');
const Faculty = require("../models/Faculty");

const router = express.Router();

// Create announcement (restricted to club leads)
router.post('/', authenticateJWT, async (req, res) => {
    const { facultyId, text } = req.body;
    // console.log(req.body);
    try {
      const user = await Faculty.findById(facultyId);
      if (user && user.role === 'professor' && user.isProctor) {
        const authorRole = user.isProctor ? 'proctor' : 'professor';
        const announcement = new Announcement({
          authorId: facultyId,
          text,
          authorRole: authorRole,
          authorName: user.fullName,
        });
        await announcement.save();
        res.status(201).json({ success: true, data: announcement });
      } else {
        console.log(user);
        res.status(403).json({ success: false, message: 'Only Proctors can make announcements' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Fetch all announcements
  router.get('/', authenticateJWT, async (req, res) => {
    try {
      const announcements = await Announcement.find().sort({ timestamp: -1 });
      // console.log("Announcements data: ",announcements);
      res.status(200).json({ success: true, data: announcements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

module.exports = router;
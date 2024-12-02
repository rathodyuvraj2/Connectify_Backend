const express = require('express');
const router = express.Router();
// const { authMiddleware } = require('../middleware/authMiddleware');
const {authMiddleware} = require("../middleware/auth");
const Faculty = require('../models/Faculty');
const Remark = require('../models/Remark');
const Announcement = require("../models/Announcement");
const Attendance = require("../models/Attendance");
const Mark = require("../models/Mark");
const Admin = require('../models/Admin');
const User = require('../models/User');
const Group = require('../models/Group');

// // Nominate a faculty as proctor
// router.post('/nominate-proctor', authMiddleware, async (req, res) => {
//     const { facultyId } = req.body;
//     try {
//         const faculty = await Faculty.findById(facultyId);
//         if (!faculty) {
//             return res.status(404).json({ success: false, message: 'Faculty not found' });
//         }
//         faculty.isProctor = true;
//         await faculty.save();
//         res.status(200).json({ success: true, data: faculty });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// Toggle faculty proctor status (promote/demote)
router.post('/nominate-proctor', authMiddleware, async (req, res) => {
  const { facultyId } = req.body;
  try {
      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
          return res.status(404).json({ success: false, message: 'Faculty not found' });
      }
      // Toggle proctor status
      faculty.isProctor = !faculty.isProctor;
      await faculty.save();
      
      const statusMessage = faculty.isProctor ? 'promoted to proctor' : 'demoted to professor';
      res.status(200).json({ 
          success: true, 
          message: `Faculty successfully ${statusMessage}`,
          data: faculty 
      });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

// Get all faculty
router.get('/faculty', authMiddleware, async (req, res) => {
    try {
        const faculty = await Faculty.find({ role: 'professor' });
        res.json({ success: true, data: faculty });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all proctors
router.get('/proctors', authMiddleware, async (req, res) => {
    try {
        const faculties = await Faculty.find({ role : "professor" });
        const proctors = faculties.filter(faculty => faculty.isProctor);
        // console.log("Proctors: ", proctors);
        res.json({ success: true, data: proctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all announcements
router.get('/announcements', authMiddleware, async (req, res) => {
    try {
        const announcements = await Announcement.find({});
        res.json({ success: true, data: announcements });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// now give me update faculty and then delete faculty routes

// // Add a new faculty
// router.post('/faculty', authMiddleware, async (req, res) => {
//     const { fullName, email } = req.body;
//     try {
//         const faculty = new Faculty({
//             fullName,
//             email,
//             role: 'professor'
//         });
//         await faculty.save();
//         res.status(201).json({ success: true, data: faculty });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Update a faculty
// router.put('/faculty/:facultyId', authMiddleware, async (req, res) => {
//     const { facultyId } = req.params;
//     const { fullName, email } = req.body;
//     try {
//         const faculty = await Faculty.findOne({ _id: facultyId });
//         if (!faculty) {
//             return res.status(404).json({ success: false, message: 'Faculty not found' });
//         }
//         faculty.fullName = fullName;
//         faculty.email = email;
//         await faculty.save();
//         res.status(200).json({ success: true, data: faculty });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }
// );

// // Delete a faculty
// router.delete('/faculty/:facultyId', authMiddleware, async (req, res) => {
//     const { facultyId } = req.params;
//     try {
//         const faculty = await Faculty.findOneAndDelete({ _id: facultyId });
//         if (!faculty) {
//             return res.status(404).json({ success: false, message: 'Faculty not found' });
//         }
//         res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });


// Add new faculty
router.post('/faculty', authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        req.body.password = req.body.employeeId;
        req.body.officeHours = "Mon-Fri, 2:00 PM - 4:00 PM";
        console.log(req.body);
      const faculty = new Faculty(req.body);
      await faculty.save();
      res.status(201).json({ success: true, data: faculty });
    } catch (error) {
        console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Update faculty
  router.put('/faculty/:id', authMiddleware, async (req, res) => {
    try {
      const faculty = await Faculty.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json({ success: true, data: faculty });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Delete faculty
  router.delete('/faculty/:id', authMiddleware, async (req, res) => {
    try {
      await Faculty.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Faculty deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

// Get all students
router.get('/students', authMiddleware, async (req, res) => {
    try {
      const students = await User.find({ role: 'student' }).select('-password');
      res.json({ success: true, data: students });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Get all groups
  router.get('/groups', authMiddleware, async (req, res) => {
    try {
      const groups = await Group.find().populate('members', 'fullName');
      res.json({ success: true, data: groups });
    } catch (error) {
        console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Get dashboard stats
  router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const faculties = await Faculty.find({ role: "professor" });
        const proctors = faculties.filter(faculty => faculty.isProctor);
      const stats = {
        totalFaculty: await Faculty.countDocuments(),
        totalStudents: await User.countDocuments({ role: 'student' }),
        // totalProctors: await Faculty.countDocuments({ role: "professor", isProctor: true }),
        totalProctors: proctors.length,
        totalGroups: await Group.countDocuments()
      };
      res.json({ success: true, data: stats });
    } catch (error) {
    console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  });



module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const Faculty = require('../models/Faculty');
const Remark = require('../models/Remark');
const User = require('../models/User');
const Announcement = require("../models/Announcement");
const Attendance = require("../models/Attendance");
const Mark = require("../models/Mark");
const multer = require('multer');
const xlsx = require('xlsx');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add this route
router.post('/update-profile-photo', authenticateJWT, async (req, res) => {
  try {
    const { imageUrl, facultyId } = req.body;
    const faculty = await Faculty.findById(facultyId);
    
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    faculty.profileImage = imageUrl;
    await faculty.save();

    res.status(200).json({
      success: true,
      data: faculty,
      message: 'Profile photo updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all students
router.get('/students', authenticateJWT, async (req, res) => {
  try {
    const students = await User.find({ $or: [{ role: 'student' }, { role: 'clubLead' }] }).select('-password');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new remark
router.post('/remarks', authenticateJWT, async (req, res) => {
  const { studentId, text, facultyId } = req.body;
  console.log(req.body);

  try {
    const newRemark = new Remark({
      student: studentId,
      faculty: facultyId,
      text
    });
    await newRemark.save();
    res.status(201).json({ success: true, data: newRemark });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update a remark
router.put('/remarks/:remarkId', authenticateJWT, async (req, res) => {
  const { remarkId } = req.params;
  const { text } = req.body;
  console.log("remark req data: ",req.body);
  // const facultyId = req.body.user._id;

  try {
    const remark = await Remark.findOne({ _id: remarkId});
    
    if (!remark) {
      return res.status(404).json({ success: false, message: 'Remark not found or unauthorized' });
    }

    remark.text = text;
    await remark.save();
    
    res.status(200).json({ success: true, data: remark });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a remark
router.delete('/remarks/:remarkId', authenticateJWT, async (req, res) => {
  const { remarkId } = req.params;
  // const facultyId = req.body.user._id;

  try {
    const remark = await Remark.findOneAndDelete({ _id: remarkId});
    
    if (!remark) {
      return res.status(404).json({ success: false, message: 'Remark not found or unauthorized' });
    }
    
    res.status(200).json({ success: true, message: 'Remark deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Get remarks for a specific student created by the logged-in faculty
router.get('/remarks/:studentId', authenticateJWT, async (req, res) => {
  const { studentId } = req.params;
  console.log("res body: ",req.body);
  const facultyId = req.body.user._id;

  try {
    const remarks = await Remark.find({ student: studentId, faculty: facultyId }).populate('faculty', 'fullName email role');
    res.status(200).json({ success: true, data: remarks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get faculty details by ID along with remarks
router.get('/:facultyId', authenticateJWT, async (req, res) => {
  const { facultyId } = req.params;

  try {
    const faculty = await Faculty.findById(facultyId).populate({
      path: 'remarks',
      // populate: { path: 'student', select: 'fullName email studentId semester' }
      populate: { path: 'student', select: 'email studentId fullName' }
    });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Mark attendance
router.post('/attendance', authenticateJWT, async (req, res) => {
  const { studentId, status, date, semester, subject, professorId } = req.body;
  // const professorId = req.body.user._id;

  try {
    const attendance = new Attendance({
      student: studentId,
      professor: professorId,
      status,
      date,
      semester,
      subject
    });
    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Update attendance
router.put('/attendance/:attendanceId', authenticateJWT, async (req, res) => {
  const { attendanceId } = req.params;
  const { status, date, semester, subject } = req.body;

  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance not found' });
    }

    attendance.status = status;
    attendance.date = date;
    attendance.semester = semester;
    attendance.subject = subject;
    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all attendance records
router.get('/attendance', authenticateJWT, async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate('student', 'fullName email studentId semester').populate('professor', 'fullName email');
    res.status(200).json({ success: true, data: attendanceRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update marks
router.post('/marks', authenticateJWT, async (req, res) => {
  const { studentId, internalExam1, internalExam2, subject, professorId } = req.body;
  // const professorId = req.user._id;

  try {
    const marks = new Mark({
      student: studentId,
      professor: professorId,
      internalExam1,
      internalExam2,
      subject
    });
    await marks.save();
    res.status(201).json({ success: true, data: marks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Update marks
router.put('/marks/:markId', authenticateJWT, async (req, res) => {
  const { markId } = req.params;
  const { internalExam1, internalExam2, subject } = req.body;

  try {
    const marks = await Mark.findById(markId);
    if (!marks) {
      return res.status(404).json({ success: false, message: 'Marks not found' });
    }

    marks.internalExam1 = internalExam1;
    marks.internalExam2 = internalExam2;
    marks.subject = subject;
    await marks.save();

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all marks records
router.get('/marks', authenticateJWT, async (req, res) => {
  try {
    const marksRecords = await Mark.find().populate('student', 'fullName email studentId semester').populate('professor', 'fullName email');
    res.status(200).json({ success: true, data: marksRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update faculty profile
// router.put('/profile/update', authenticateJWT, async (req, res) => {
//   try {
//     const { fullName, phoneNumber, officeHours, officeLocation } = req.body;
//     const faculty = await Faculty.findById(req.body._id);

//     if (!faculty) {
//       return res.status(404).json({ success: false, message: 'Faculty not found' });
//     }

//     faculty.fullName = fullName || faculty.fullName;
//     faculty.phoneNumber = phoneNumber || faculty.phoneNumber;
//     faculty.officeHours = officeHours || faculty.officeHours;
//     faculty.officeLocation = officeLocation || faculty.officeLocation;

//     await faculty.save();

//     res.status(200).json({
//       success: true,
//       data: faculty
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// Update faculty profile
router.put('/profile/update', authenticateJWT, async (req, res) => {
  try {
    const { phoneNumber, officeLocation, officeHours, specialization, qualifications, facultyId } = req.body;
    // console.log(req.body);
    // const facultyId = req.user._id;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    faculty.phoneNumber = phoneNumber;
    faculty.officeLocation = officeLocation;
    faculty.officeHours = officeHours;
    faculty.specialization = specialization;
    faculty.qualifications = qualifications;

    await faculty.save();

    res.status(200).json({
      success: true,
      data: faculty,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Bulk attendance upload
router.post('/attendance/bulk', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const results = await Promise.all(data.map(async (row) => {
      const student = await User.findOne({ studentId: row['Enrollment No'] });
      if (!student) return null;

      const attendance = new Attendance({
        student: student._id,
        professor: req.body.professorId,
        date: new Date(row.Date),
        subject: row.Subject,
        status: row.Status.toLowerCase(),
        semester: req.body.semester
      });

      return attendance.save();
    }));

    const successful = results.filter(Boolean).length;
    res.status(200).json({
      success: true,
      message: `Successfully processed ${successful} attendance records`,
      data: results.filter(Boolean)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk marks upload
router.post('/marks/bulk', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const results = await Promise.all(data.map(async (row) => {
      const student = await User.findOne({ studentId: row['Enrollment No'] });
      if (!student) return null;

      const marks = new Mark({
        student: student._id,
        professor: req.body.professorId,
        subject: row.Subject,
        internalExam1: row['Internal Exam 1'],
        internalExam2: row['Internal Exam 2'],
        semester: req.body.semester
      });

      return marks.save();
    }));

    const successful = results.filter(Boolean).length;
    res.status(200).json({
      success: true,
      message: `Successfully processed ${successful} marks records`,
      data: results.filter(Boolean)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Get attendance by semester and subject
router.get('/attendance/:semester/:subject', authenticateJWT, async (req, res) => {
  try {
    const attendance = await Attendance.find({
      semester: req.params.semester,
      subject: req.params.subject
    }).populate('student', 'fullName studentId');

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get marks by semester and subject
router.get('/marks/:semester/:subject', authenticateJWT, async (req, res) => {
  try {
    const marks = await Mark.find({
      semester: req.params.semester,
      subject: req.params.subject
    }).populate('student', 'fullName studentId');

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Nominate club lead
router.post('/nominateClubLead', authenticateJWT, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.role = 'clubLead';
    await user.save();
    res.json({ success: true, message: 'User nominated as Club Lead successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
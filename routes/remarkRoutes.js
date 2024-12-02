const express = require('express');
const Remark = require('../models/Remark');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new remark
router.post('/', authenticateJWT, async (req, res) => {
  const { studentId, text } = req.body;
  const createdBy = req.user._id;

  try {
    const newRemark = new Remark({ student: studentId, createdBy, text });
    await newRemark.save();
    res.status(201).json({ success: true, data: newRemark });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get remarks for a specific student created by the logged-in user
router.get('/:studentId', authenticateJWT, async (req, res) => {
  const { studentId } = req.params;
  const createdBy = req.user._id;
  try {
    const remarks = await Remark.find({ student: studentId, createdBy });
    console.log("Remarks: ",remarks);
    res.status(200).json({ success: true, data: remarks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
// // backend/routes/userRoutes.js
// const express = require('express');
// const User = require('../models/User');
// const { auth } = require('../middleware/auth');
// const bcrypt = require('bcrypt');
// const Marks = require('../models/Mark');
// const Attendance = require('../models/Attendance');

// const router = express.Router();

// // Get all users
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find({}); // Await the result of the query
//     // console.log("users data: ", users);
//     res.json({users}); // Return the users as a plain JSON object
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get user profile
// router.get('/profile', auth, async (req, res) => {
//   try {
//     res.json(req.user);
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Nominate club lead
// router.post('/nominate-club-lead', auth, async (req, res) => {
//   const { userId } = req.body;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     user.role = 'clubLead';
//     await user.save();
//     res.json({ success: true, message: 'User nominated as Club Lead successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Add a new user
// router.post('/', auth, async (req, res) => {
//   // console.log("req.body: ", req.body);
//   const { fullName, email, studentId,semester, role, password } = req.body;
//   try {
//     const newUser = new User({ fullName, email, studentId,semester, role, password });
//     await newUser.save();
//     res.status(201).json({ success: true, data: newUser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Get user details by ID
// router.get('/:userId', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const marks = await Marks.find({ student: req.params.userId });
//     const attendance = await Attendance.find({ student: req.params.userId });

//     const userData = {
//       ...user.toObject(),
//       marks,
//       attendance
//     };

//     res.status(200).json({ success: true, data: userData });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Update a user
// router.put('/:userId', auth, async (req, res) => {
//   try {
//     // while updating the password hash it before directly updating it
//     if (req.body.password) {
//       req.body.password = await bcrypt.hash(req.body.password, 10);
//     }
//     const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// });


// // Delete a user
// router.delete('/:userId', auth, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     res.status(200).json({ success: true, message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Update user profile
// router.put('/profile/update', auth, async (req, res) => {
//   try {
//     if (req.body.password) {
//       req.body.password = await bcrypt.hash(req.body.password, 10);
//     }
//     const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// });


// module.exports = router;

// --------------------------------------------------------

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const Marks = require('../models/Mark');
const Attendance = require('../models/Attendance');
const Resume = require("../models/Resume");
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/update-profile-photo', authMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.profilePicture = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile photo updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('/:userId', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const marks = await Marks.find({ student: req.params.userId });
//     const attendance = await Attendance.find({ student: req.params.userId });

//     res.status(200).json({
//       success: true,
//       data: {
//         ...user.toObject(),
//         marks,
//         attendance
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// new code --------
// router.get('/:userId', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const marks = await Marks.find({ student: req.params.userId });
//     const attendance = await Attendance.find({ student: req.params.userId });
//     const resumes = await Resume.find({ user: req.params.userId }).select('_id title createdAt');

//     res.status(200).json({
//       success: true,
//       data: {
//         ...user.toObject(),
//         marks,
//         attendance,
//         resumes
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [marks, attendance, resumes, projects, certifications] = await Promise.all([
      Marks.find({ student: req.params.userId }),
      Attendance.find({ student: req.params.userId }),
      Resume.find({ user: req.params.userId }).select('_id title createdAt'),
      Project.find({ user: req.params.userId }),
      Certification.find({ user: req.params.userId })
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        marks,
        attendance,
        resumes,
        projects,
        certifications
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  console.log("req.body: ", req.body);
  const { fullName, email, studentId, semester, role, password,department,gender,enrollmentDate,phoneNumber,batch } = req.body;
  const profilePicture = `https://api.dicebear.com/6.x/initials/svg?seed=${fullName}`;
  try {
    const newUser = new User({ fullName, email, studentId, semester, role, password,department, gender, enrollmentDate, phoneNumber, batch, profilePicture });
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// router.delete('/:userId', authMiddleware, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.userId);
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Update user profile

router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/profile/update', authMiddleware, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Project Routes
router.post('/projects', authMiddleware, async (req, res) => {
  try {
    console.log("req.body: ",req.body);
    const project = new Project({
      ...req.body
    });
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId},
      req.body,
      { new: true }
    );
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    await Project.findOneAndDelete({ 
      _id: req.params.projectId
    });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Certification Routes
router.post('/certifications', authMiddleware, async (req, res) => {
  try {
    const certification = new Certification({
      ...req.body
    });
    await certification.save();
    res.status(201).json({ success: true, data: certification });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/certifications/:certId', authMiddleware, async (req, res) => {
  try {
    const certification = await Certification.findOneAndUpdate(
      { _id: req.params.certId },
      req.body,
      { new: true }
    );
    res.json({ success: true, data: certification });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/certifications/:certId', authMiddleware, async (req, res) => {
  try {
    await Certification.findOneAndDelete({ 
      _id: req.params.certId
    });
    res.json({ success: true, message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-profile-photo', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    const result = await cloudinary.uploader.upload_stream({
      folder: 'student_profiles',
    }, async (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }

      const user = await User.findById(userId);
      user.profilePicture = result.secure_url;
      await user.save();

      res.status(200).json({
        success: true,
        data: {
          imageUrl: result.secure_url,
          user: user
        }
      });
    }).end(file.buffer);

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
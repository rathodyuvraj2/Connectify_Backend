// // backend/routes/authRoutes.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
// const generateToken = require('../config/jwt');

// const router = express.Router();

// // Register
// router.post('/register', async (req, res) => {
//   const { fullName, email, password, role, studentId } = req.body;
//   console.log("req.body: ",req.body);
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'User already exists' });

//     const user = new User({ fullName, email, password, role, studentId });
//     await user.save();

//     res.status(201).json({ token: generateToken(user),message: 'User created successfully' });
//   } catch (error) {
//     console.log("error:",error)
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     console.log("user: ",user);
//     console.log("user.id: ",user._id.toString());
//     const token = generateToken(user);
//     console.log("token: ",token);

//     // res.status(200).json({ token:token, role:user.role,UserId:user._id.toString() });
//     res.status(200).json({ token:token, user: user });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// ----------------------------------------------------------------
  
// const express = require('express');
//   const bcrypt = require('bcrypt');
//   const jwt = require('jsonwebtoken');
//   const User = require('../models/User');
//   const Faculty = require('../models/Faculty');
//   const Admin = require('../models/Admin'); // Assuming you have an Admin model
//   const router = express.Router();

//   router.post('/login', async (req, res) => {
//     const { email, password, role } = req.body;
//     console.log(req.body);

//     try {
//       let user;
//       let userRole = role;
//       if (role === 'student') {
//         user = await User.findOne({ email });
//       } else if (role === 'faculty') {
//         user = await Faculty.findOne({ email });
//       } else if (role === 'admin') {
//         user = await Admin.findOne({ email });
//       }

//       if (!user) {
//         console.log("User not found:", email);
//         return res.status(401).json({ 
//           success: false,
//           message: 'Invalid credentials' 
//         });
//       }
//       console.log("user: ",user);

//       const isMatch = await bcrypt.compare(password, user.password);
//       console.log(isMatch);
//       if (!isMatch) {
//         console.log("Password mismatch for:", email);
//         return res.status(401).json({ 
//           success: false,
//           message: 'Invalid credentials' 
//         });
//       }

//       const token = jwt.sign({ id: user._id, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });

//       console.log("user data: ",user);
//       console.log("user role: ", user.role);
//       // us
//       if(user.role){
//         userRole = user.role;
//       }
//       res.status(200).json({
//         success: true,
//         token,
//         user: {
//           _id: user._id,
//           email: user.email,
//           role: userRole,
//           fullName: user.fullName
//         }
//       });
//     } catch (error) {
//       console.log("Login error:", error);
//       res.status(500).json({ 
//         success: false,
//         message: 'Server error' 
//       });
//     }
//   });


// // Register
// router.post('/register', async (req, res) => {
//   const { fullName, email, password, role, studentId } = req.body;
//   console.log("req.body: ", req.body);
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'User already exists' });

//     const user = new User({ fullName, email, password, role, studentId });
//     await user.save();

//     res.status(201).json({ token: generateToken(user), message: 'User created successfully' });
//   } catch (error) {
//     console.log("error:", error)
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// ----------------------------------------------

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
// const generateToken = require('../config/jwt');

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
    
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
    
//     const token = generateToken(user);
//     res.json({ token, user: { id: user._id, role: user.role, email: user.email } });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/register', async (req, res) => {
//   try {
//     const { fullName, email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     const user = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//       role
//     });
    
//     await user.save();
//     const token = generateToken(user);
//     res.status(201).json({ token, user: { id: user._id, role: user.role, email: user.email } });
//   } catch (error) {
//     res.status(400).json({ message: 'Registration failed' });
//   }
// });

// module.exports = router;

// ----------------------------------------------------------

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role }); // Single login attempt log

    // Clear any existing tokens from headers
    delete req.headers.authorization;

    let user;
    if (role === 'student') {
      user = await User.findOne({ email });
    } else if (role === 'professor' || role === 'proctor') {
      user = await Faculty.findOne({ email });
    } else if (role === 'admin' && email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
          { id: 'admin', role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        return res.json({
          success: true,
          token,
          user: { id: 'admin', email, role: 'admin' }
        });
      }
    }

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }    
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isClubLead: user.isClubLead,
        isProctor: user.isProctor,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});



module.exports = router;
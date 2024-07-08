const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userSchema');
const { authenticateUser } = require('../middleware/authMiddleware');

// Sign up route
router.get('/signup',(req,res)=>{
  res.render('signup')
})


router.get('/signin',(req,res)=>{
  res.render('signin')
})

router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Create new user
    const newUser = new User({
      username,
      password: passwordHash,
      email
    });

    await newUser.save();

    const accessToken = generateAccessToken({ id: newUser._id, username: newUser.username });
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Sign in route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ id: user._id, username: user.username });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to generate JWT token
const generateAccessToken = (userData) => {
  return jwt.sign(userData, config.secretKey);
};

module.exports = router;
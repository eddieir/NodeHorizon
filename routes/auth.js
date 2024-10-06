const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/userModel');  // Assuming you have a User model
const SendEmail = require('../utiils/emailService');
const TokenBlacklist = require('../models/TokenBlackList');



router.post('/logout', async (req, res) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const blacklistedToken = new TokenBlacklist({ token });
        await blacklistedToken.save();
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out.', error });
    }
});
// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; // Expect name here
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
        name, // Ensure name is being set here
        email,
        password,
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
// Request Password Reset
router.post('/password-reset', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:5000/api/auth/reset-password/${token}`;
        await sendEmail(user.email, 'Password Reset', `Click this link to reset your password: ${resetUrl}`);

        res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email.', error });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Could not reset password.', error });
    }
});
// POST /api/auth/login - Log in an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

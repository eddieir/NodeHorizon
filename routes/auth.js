const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/userModel');  // Assuming you have a User model
const SendEmail = require('../utiils/emailService');
const TokenBlacklist = require('../models/TokenBlackList');
const authenticate = require('../middlewares/auth');
const crypto = require('crypto');
const { logInfo, logError } = require('../logger');


router.post('/logout', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Clear the refresh token
      user.refreshToken = null;
      await user.save();
  
      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    console.log(req.body);
    // Check if the request body contains the expected properties
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
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
            logInfo(`Password reset attempt for non-existent user: ${email}`);
            return res.status(404).json({ message: 'User not found.' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:5000/api/auth/reset-password/${token}`;
        logInfo(`Password reset requested for user: ${email}, token: ${resetToken}`);
        await sendEmail(user.email, 'Password Reset', `Click this link to reset your password: ${resetUrl}`);

        res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (error) {
        logError('Error in reset-password', { error, email });
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
        logInfo(`Failed login attempt: ${email}`);
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a short-living JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    // Generate a secure refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();
    const accessToken = jwt.sign(
        { id: user._id, email: user.email }, // Payload (data to encode in the token)
        process.env.JWT_SECRET,               // Secret key from .env file
        //{ expiresIn: '1h' }                   // Token expiration time 
      );
    logInfo(`Successful login for user: ${email}`);  
    // Send both tokens to the client
    res.json({ accessToken, refreshToken });


    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    //console.error(err);
    logError('Login Error', { error });
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token is required' });
    }
  
    try {
      // Find user with matching refresh token
      const user = await User.findOne({ refreshToken });
  
      if (!user) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
  
      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Set short-lived expiry for access token
      );
  
      // Send the new access token
      res.json({ accessToken });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;

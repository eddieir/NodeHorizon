const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    deleteUser
} = require('../contollers/userController');
const { protect } = require('../middlewares/authMiddleware'); // For protecting routes
const { adminProtect } = require('../middlewares/adminMiddleware'); // To create an admin check middleware
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
    .get(protect, getUserProfile)        // Get logged-in user's profile
    .put(protect, updateUserProfile);    // Update logged-in user's profile

router.put('/change-password', protect, changePassword); // Change password

// Admin routes
router.route('/')
    .get(protect, adminProtect, getAllUsers);  // Get all users (admin only)

router.route('/:id')
    .delete(protect, adminProtect, deleteUser); // Delete a user (admin only)

module.exports = router;

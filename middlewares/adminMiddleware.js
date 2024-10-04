const User = require('../models/userModel');

// Middleware to check if the user is an admin
const adminProtect = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { adminProtect };

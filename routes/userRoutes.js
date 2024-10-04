const express = require('express');
const { registerUser, loginUser } = require('../contollers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

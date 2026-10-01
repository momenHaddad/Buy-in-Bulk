const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();
const authorizedRoles = require('../middlewares/rloeMiddleware');
const User = require('../models/userModel');

//admin routes
router.get('/admin', verifyToken, authorizedRoles("admin"), (req, res) => {
    res.send('welcome admin');
});

// Get all users
router.get('/', verifyToken, authorizedRoles("admin"), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router; 

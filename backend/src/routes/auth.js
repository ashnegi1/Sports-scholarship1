const express = require('express');
const { register, login, getMe, logout, getAllUsers, seedUsers } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
// Debug routes - should be disabled in production
router.get('/debug/users', getAllUsers);
router.post('/debug/seed', seedUsers);

module.exports = router; 
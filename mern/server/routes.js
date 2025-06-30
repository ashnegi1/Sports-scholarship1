const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  user_metadata: { type: Object }
});

const User = mongoose.model('User', userSchema);

// Create new user (register or sync)
router.post('/users', async (req, res) => {
  try {
    const { id, email, name, role, user_metadata } = req.body;
    const user = new User({ id, email, name, role, user_metadata });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

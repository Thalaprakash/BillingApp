const express = require('express');
const router = express.Router();
const User = require('../models/User');

// --- GET ALL USERS (Admin only) ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// --- TOGGLE USER ACTIVE/INACTIVE (Admin only) ---
router.patch('/toggle-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.active = !user.active;
    await user.save();

    res.json({ message: 'User status updated', user });
  } catch (err) {
    console.error('Toggle user error:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

module.exports = router;

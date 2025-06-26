const express = require('express');
const router = express.Router();
const User = require('../models/User');

// --- GET ALL USERS (Admin only) ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');

    // Calculate plan status before sending
    const updatedUsers = users.map(user => {
      const now = new Date();
      let planStatus = 'Valid';

      if (user.planExpiresAt && now > user.planExpiresAt) {
        planStatus = 'Expired';
      }

      return {
        ...user.toObject(),
        planStatus,
      };
    });

    res.json(updatedUsers);
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


// --- OPTIONAL: UPDATE PLAN TYPE (Admin sets 1-month / 6-month / 1-year) ---
router.patch('/update-plan/:id', async (req, res) => {
  const { plan } = req.body;
  if (!['1-month', '6-month', '1-year'].includes(plan)) {
    return res.status(400).json({ message: 'Invalid plan type' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.plan = plan;
    user.planStartDate = new Date(); // reset to now
    await user.save(); // planExpiresAt will auto-update via schema

    res.json({ message: 'Plan updated successfully', user });
  } catch (err) {
    console.error('Update plan error:', err);
    res.status(500).json({ message: 'Failed to update user plan' });
  }
});

module.exports = router;
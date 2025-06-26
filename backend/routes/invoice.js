const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// --- CREATE INVOICE ---
router.post('/', async (req, res) => {
  const { userId, amount, description } = req.body;

  if (!userId || !amount || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || !user.active) {
      return res.status(403).json({ message: 'Invalid or deactivated user' });
    }

    const invoice = new Invoice({ userId, amount, description });
    await invoice.save();

    res.status(201).json({ message: 'Invoice created', invoice });
  } catch (err) {
    console.error('Invoice creation error:', err);
    res.status(500).json({ message: 'Failed to create invoice' });
  }
});
module.exports = router;
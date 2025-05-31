
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'Email not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetURL = `http://localhost:3000/reset-password/${token}`;
  await sendEmail(user.email, 'Reset your password', `Click to reset: ${resetURL}`);

  res.json({ message: 'Reset email sent' });
};

exports.resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated' });
};


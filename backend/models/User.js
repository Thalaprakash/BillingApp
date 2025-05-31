const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  role: { type: String, default: 'user' },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', UserSchema);

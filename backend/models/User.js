const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  active: { type: Boolean, default: true },

  // Plan-related fields
  plan: {
    type: String,
    enum: ['1-month', '6-month', '1-year'],
    default: '1-year',
  },
  planStartDate: {
    type: Date,
    default: Date.now,
  },
  planExpiresAt: Date,

}, { timestamps: true });

// Automatically set planExpiresAt based on planStartDate
userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('plan')) {
    const start = this.planStartDate || new Date();
    let expires;

    switch (this.plan) {
      case '1-month':
        expires = new Date(start);
        expires.setMonth(start.getMonth() + 1);
        break;
      case '6-month':
        expires = new Date(start);
        expires.setMonth(start.getMonth() + 6);
        break;
      case '1-year':
      default:
        expires = new Date(start);
        expires.setFullYear(start.getFullYear() + 1);
        break;
    }

    this.planStartDate = start;
    this.planExpiresAt = expires;
    
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

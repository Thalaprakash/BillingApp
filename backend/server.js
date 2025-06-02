require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const User = require('./models/User');
const Invoice = require('./models/Invoice');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connect (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// SIGNUP route
app.post('/signup', async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role: role || 'user',
      active: true,
    });

    await newUser.save();

    const userToReturn = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      active: newUser.active,
    };

    res.status(201).json({ message: 'User created successfully', user: userToReturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'Your account is deactivated. Contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userToReturn = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      active: user.active,
    };

    res.json({ message: 'Login successful', user: userToReturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// CREATE INVOICE
app.post('/invoices', async (req, res) => {
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
    console.error(err);
    res.status(500).json({ message: 'Failed to create invoice' });
  }
});

// GET INVOICES FOR LOGGED-IN USER
app.post('/my-invoices', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    const invoices = await Invoice.find({ userId });
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
});

// FORGOT PASSWORD (Mock)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'No user found with this email' });
  }

  res.status(200).json({ message: 'Password reset link sent (mock)' });
});

// GET ALL USERS (Admin only)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// TOGGLE USER ACTIVE/INACTIVE (Admin only)
app.patch('/toggle-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.active = !user.active;
    await user.save();

    res.json({ message: 'User status updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Serve frontend (Vue/React)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

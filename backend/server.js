const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const invoiceRoutes = require('./routes/invoice');

const app = express();

// ✅ CORS Setup
const corsOptions = {
  origin: ['https://www.pminfostech.com'],  // Your frontend domain
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/invoices', invoiceRoutes);

// ✅ Serve React build (if needed)
const path = require('path');
app.use(express.static(path.join(__dirname, '../bill/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../bill/dist/index.html'));
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

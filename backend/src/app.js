const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const privateRoutes = require('./routes/private.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(uploadDir)));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'HealthMap Bali API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/private', privateRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  if (err.message?.includes('Format file')) {
    return res.status(422).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

module.exports = app;

const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

// Middleware untuk memvalidasi JWT token dan menyematkan data user yang login ke req.user
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa' });
  }
}

// Middleware untuk memvalidasi apakah user yang login memiliki role 'admin'
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses admin diperlukan' });
  }
  next();
}

module.exports = { authenticate, requireAdmin };

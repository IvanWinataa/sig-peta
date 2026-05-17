const pool = require('../config/db');

async function checkOwnership(req, res, next) {
  if (req.user.role === 'admin') return next();

  const { id } = req.params;
  const result = await pool.query(
    'SELECT created_by FROM fasilitas_kesehatan WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Fasilitas tidak ditemukan' });
  }

  if (result.rows[0].created_by !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk mengelola fasilitas ini',
    });
  }

  next();
}

module.exports = { checkOwnership };

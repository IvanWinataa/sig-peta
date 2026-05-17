const pool = require('../config/db');

// --- Public ---
async function getSpesialisPublic(_req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nama_spesialis FROM master_spesialis ORDER BY nama_spesialis'
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function getJenisFasilitasPublic(_req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nama_jenis FROM master_jenis_fasilitas ORDER BY nama_jenis'
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// --- Admin Spesialis ---
async function getSpesialisAdmin(_req, res) {
  try {
    const result = await pool.query('SELECT * FROM master_spesialis ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function createSpesialis(req, res) {
  try {
    const { nama_spesialis } = req.body;
    const result = await pool.query(
      'INSERT INTO master_spesialis (nama_spesialis) VALUES ($1) RETURNING *',
      [nama_spesialis]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(422).json({ success: false, message: 'Nama spesialis sudah ada' });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function updateSpesialis(req, res) {
  try {
    const { nama_spesialis } = req.body;
    const result = await pool.query(
      'UPDATE master_spesialis SET nama_spesialis = $1 WHERE id = $2 RETURNING *',
      [nama_spesialis, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Spesialis tidak ditemukan' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function deleteSpesialis(req, res) {
  try {
    await pool.query('DELETE FROM master_spesialis WHERE id = $1', [req.params.id]);
    return res.json({ success: true, message: 'Spesialis dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// --- Admin Jenis Fasilitas ---
async function getJenisFasilitasAdmin(_req, res) {
  try {
    const result = await pool.query('SELECT * FROM master_jenis_fasilitas ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function createJenisFasilitas(req, res) {
  try {
    const { nama_jenis } = req.body;
    const result = await pool.query(
      'INSERT INTO master_jenis_fasilitas (nama_jenis) VALUES ($1) RETURNING *',
      [nama_jenis]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(422).json({ success: false, message: 'Nama jenis fasilitas sudah ada' });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function updateJenisFasilitas(req, res) {
  try {
    const { nama_jenis } = req.body;
    const result = await pool.query(
      'UPDATE master_jenis_fasilitas SET nama_jenis = $1 WHERE id = $2 RETURNING *',
      [nama_jenis, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Jenis fasilitas tidak ditemukan' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function deleteJenisFasilitas(req, res) {
  try {
    await pool.query('DELETE FROM master_jenis_fasilitas WHERE id = $1', [req.params.id]);
    return res.json({ success: true, message: 'Jenis fasilitas dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

module.exports = {
  getSpesialisPublic,
  getJenisFasilitasPublic,
  getSpesialisAdmin,
  createSpesialis,
  updateSpesialis,
  deleteSpesialis,
  getJenisFasilitasAdmin,
  createJenisFasilitas,
  updateJenisFasilitas,
  deleteJenisFasilitas,
};

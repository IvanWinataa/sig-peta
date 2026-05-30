const pool = require('../config/db');
const { buildListQuery } = require('../utils/fasilitasQuery');

// Mengambil semua daftar fasilitas kesehatan dari database untuk dikelola oleh admin
async function getAllFasilitas(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const { countQuery, dataQuery, params, countParams } = buildListQuery({
      kategori_id: req.query.kategori_id ? parseInt(req.query.kategori_id, 10) : null,
      search: req.query.search || null,
      page,
      limit,
    });

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, countParams),
      pool.query(dataQuery, params),
    ]);

    const total = countResult.rows[0].total;
    return res.json({
      success: true,
      data: dataResult.rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Menghapus fasilitas kesehatan apa saja oleh admin berdasarkan ID tanpa validasi kepemilikan
async function deleteFasilitasAdmin(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM fasilitas_kesehatan WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Fasilitas tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Fasilitas berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Mengambil daftar semua kategori (untuk dikelola oleh admin)
async function getKategori(_req, res) {
  try {
    const result = await pool.query('SELECT * FROM kategori ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Membuat kategori baru beserta ikon, warna marker, dan skema atributnya
async function createKategori(req, res) {
  try {
    const { nama_kategori, icon_marker, warna_marker, skema_atribut } = req.body;
    const result = await pool.query(
      `INSERT INTO kategori (nama_kategori, icon_marker, warna_marker, skema_atribut) VALUES ($1,$2,$3,$4) RETURNING *`,
      [nama_kategori, icon_marker, warna_marker, JSON.stringify(skema_atribut || [])]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(422).json({ success: false, message: 'Nama kategori sudah ada' });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Mengubah kategori, ikon, warna marker, atau skema atribut yang sudah ada berdasarkan ID
async function updateKategori(req, res) {
  try {
    const { nama_kategori, icon_marker, warna_marker, skema_atribut } = req.body;
    const result = await pool.query(
      `UPDATE kategori SET nama_kategori=$1, icon_marker=$2, warna_marker=$3, skema_atribut=$4 WHERE id=$5 RETURNING *`,
      [nama_kategori, icon_marker, warna_marker, JSON.stringify(skema_atribut || []), req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Menghapus kategori tertentu berdasarkan ID jika kategori tersebut tidak sedang digunakan oleh fasilitas mana pun
async function deleteKategori(req, res) {
  try {
    const used = await pool.query(
      'SELECT COUNT(*)::int AS c FROM fasilitas_kesehatan WHERE kategori_id = $1',
      [req.params.id]
    );
    if (used.rows[0].c > 0) {
      return res.status(400).json({
        success: false,
        message: 'Kategori masih digunakan oleh fasilitas',
      });
    }
    await pool.query('DELETE FROM kategori WHERE id = $1', [req.params.id]);
    return res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Mengambil semua user yang terdaftar dalam sistem (tanpa mengembalikan data password)
async function getUsers(_req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nama, email, role, created_at FROM users ORDER BY id'
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Mengubah nama atau role dari user tertentu berdasarkan ID
async function updateUser(req, res) {
  try {
    const { nama, role } = req.body;
    const result = await pool.query(
      'UPDATE users SET nama = $1, role = $2 WHERE id = $3 RETURNING id, nama, email, role',
      [nama, role, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Menghapus akun user tertentu berdasarkan ID (dan memvalidasi agar tidak dapat menghapus akun sendiri)
async function deleteUser(req, res) {
  try {
    if (parseInt(req.params.id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Tidak dapat menghapus akun sendiri' });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    return res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

module.exports = {
  getAllFasilitas,
  deleteFasilitasAdmin,
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  getUsers,
  updateUser,
  deleteUser,
};

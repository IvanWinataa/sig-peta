const pool = require('../config/db');
const { FASILITAS_SELECT, buildListQuery } = require('../utils/fasilitasQuery');

async function getKategori(_req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nama_kategori, icon_marker, warna_marker, skema_atribut FROM kategori ORDER BY id'
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function getFasilitasList(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const { countQuery, dataQuery, params, countParams } = buildListQuery({
      kategori_id: req.query.kategori_id ? parseInt(req.query.kategori_id, 10) : null,
      search: req.query.search || null,
      page,
      limit,
      sort: req.query.sort || 'nama_fasilitas',
      order: req.query.order || 'asc',
    });

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, countParams),
      pool.query(dataQuery, params),
    ]);

    const total = countResult.rows[0].total;
    return res.json({
      success: true,
      data: dataResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function getFasilitasById(req, res) {
  try {
    const result = await pool.query(`${FASILITAS_SELECT} WHERE f.id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Fasilitas tidak ditemukan' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

module.exports = { getKategori, getFasilitasList, getFasilitasById };

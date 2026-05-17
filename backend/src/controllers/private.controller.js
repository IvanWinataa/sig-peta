const pool = require('../config/db');
const { FASILITAS_SELECT, buildListQuery } = require('../utils/fasilitasQuery');

function normalizeJsonField(val) {
  if (val == null || val === '') return null;
  try {
    const parsed = typeof val === 'string' ? JSON.parse(val) : val;
    return JSON.stringify(parsed);
  } catch {
    return val;
  }
}

function parseBody(body) {
  return {
    nama_fasilitas: body.nama_fasilitas,
    kategori_id: parseInt(body.kategori_id, 10),
    alamat: body.alamat,
    latitude: parseFloat(body.latitude),
    longitude: parseFloat(body.longitude),
    no_telepon: body.no_telepon || null,
    email: body.email || null,
    jam_operasional: body.jam_operasional || null,
    status_24_jam: body.status_24_jam === true || body.status_24_jam === 'true',
    bpjs: body.bpjs === true || body.bpjs === 'true',
    dokter_spesialis: normalizeJsonField(body.dokter_spesialis),
    fasilitas: normalizeJsonField(body.fasilitas),
    deskripsi: body.deskripsi || null,
    rating: body.rating ? parseFloat(body.rating) : null,
  };
}

async function createFasilitas(req, res) {
  try {
    const data = parseBody(req.body);
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO fasilitas_kesehatan (
        nama_fasilitas, kategori_id, alamat, latitude, longitude,
        no_telepon, email, jam_operasional, status_24_jam, bpjs,
        dokter_spesialis, fasilitas, deskripsi, rating, foto, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING id`,
      [
        data.nama_fasilitas, data.kategori_id, data.alamat, data.latitude, data.longitude,
        data.no_telepon, data.email, data.jam_operasional, data.status_24_jam, data.bpjs,
        data.dokter_spesialis, data.fasilitas, data.deskripsi, data.rating, foto, req.user.id,
      ]
    );

    const full = await pool.query(`${FASILITAS_SELECT} WHERE f.id = $1`, [result.rows[0].id]);
    return res.status(201).json({
      success: true,
      message: 'Fasilitas berhasil ditambahkan',
      data: full.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function updateFasilitas(req, res) {
  try {
    const data = parseBody(req.body);
    const foto = req.file ? `/uploads/${req.file.filename}` : undefined;

    const fields = [
      'nama_fasilitas = $1', 'kategori_id = $2', 'alamat = $3',
      'latitude = $4', 'longitude = $5', 'no_telepon = $6', 'email = $7',
      'jam_operasional = $8', 'status_24_jam = $9', 'bpjs = $10',
      'dokter_spesialis = $11', 'fasilitas = $12', 'deskripsi = $13', 'rating = $14',
    ];
    const values = [
      data.nama_fasilitas, data.kategori_id, data.alamat, data.latitude, data.longitude,
      data.no_telepon, data.email, data.jam_operasional, data.status_24_jam, data.bpjs,
      data.dokter_spesialis, data.fasilitas, data.deskripsi, data.rating,
    ];

    if (foto !== undefined) {
      fields.push(`foto = $${values.length + 1}`);
      values.push(foto);
    }

    values.push(req.params.id);
    await pool.query(
      `UPDATE fasilitas_kesehatan SET ${fields.join(', ')} WHERE id = $${values.length}`,
      values
    );

    const full = await pool.query(`${FASILITAS_SELECT} WHERE f.id = $1`, [req.params.id]);
    return res.json({
      success: true,
      message: 'Fasilitas berhasil diperbarui',
      data: full.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function deleteFasilitas(req, res) {
  try {
    await pool.query('DELETE FROM fasilitas_kesehatan WHERE id = $1', [req.params.id]);
    return res.json({ success: true, message: 'Fasilitas berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function getMyFasilitas(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const { countQuery, dataQuery, params, countParams } = buildListQuery({
      created_by: req.user.id,
      search: req.query.search || null,
      page,
      limit,
      sort: req.query.sort || 'created_at',
      order: req.query.order || 'desc',
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

module.exports = { createFasilitas, updateFasilitas, deleteFasilitas, getMyFasilitas };

const FASILITAS_SELECT = `
  SELECT
    f.id, f.nama_fasilitas, f.kategori_id, f.alamat,
    f.latitude, f.longitude, f.no_telepon, f.email,
    f.jam_operasional, f.status_24_jam, f.bpjs,
    f.dokter_spesialis, f.fasilitas, f.deskripsi,
    f.rating, f.foto, f.created_by, f.created_at,
    k.nama_kategori, k.icon_marker, k.warna_marker,
    u.nama AS nama_pembuat
  FROM fasilitas_kesehatan f
  JOIN kategori k ON k.id = f.kategori_id
  LEFT JOIN users u ON u.id = f.created_by
`;

const SORTABLE = {
  nama_fasilitas: 'f.nama_fasilitas',
  kategori: 'k.nama_kategori',
  alamat: 'f.alamat',
  created_at: 'f.created_at',
  rating: 'f.rating',
};

function buildListQuery({ kategori_id, search, created_by, page = 1, limit = 100, sort = 'nama_fasilitas', order = 'asc' }) {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (kategori_id) {
    conditions.push(`f.kategori_id = $${paramIndex++}`);
    params.push(kategori_id);
  }

  if (created_by) {
    conditions.push(`f.created_by = $${paramIndex++}`);
    params.push(created_by);
  }

  if (search) {
    conditions.push(`(
      f.nama_fasilitas ILIKE $${paramIndex}
      OR f.alamat ILIKE $${paramIndex}
      OR k.nama_kategori ILIKE $${paramIndex}
    )`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sortCol = SORTABLE[sort] || SORTABLE.nama_fasilitas;
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const offset = (Math.max(1, page) - 1) * limit;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM fasilitas_kesehatan f
    JOIN kategori k ON k.id = f.kategori_id
    ${where}
  `;

  const dataQuery = `
    ${FASILITAS_SELECT}
    ${where}
    ORDER BY ${sortCol} ${sortOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  const countParams = [...params];
  const dataParams = [...params, limit, offset];

  return { countQuery, dataQuery, params: dataParams, countParams };
}

module.exports = { FASILITAS_SELECT, buildListQuery };

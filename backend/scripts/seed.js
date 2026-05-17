const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function seed() {
  const kategoriCount = await pool.query('SELECT COUNT(*) FROM kategori');
  if (Number(kategoriCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO kategori (nama_kategori, icon_marker, warna_marker) VALUES
        ('Rumah Sakit',    'hospital',  '#EF4444'),
        ('Klinik',         'clinic',    '#3B82F6'),
        ('Puskesmas',      'puskesmas', '#EAB308'),
        ('Apotek',         'pharmacy',  '#22C55E'),
        ('Laboratorium',   'lab',       '#A855F7'),
        ('UGD 24 Jam',     'emergency', '#F97316'),
        ('Dokter Praktik', 'doctor',    '#06B6D4'),
        ('Ambulans',       'ambulance', '#DC2626')
    `);
    console.log('Kategori seeded (8 rows).');
  }

  const spCount = await pool.query('SELECT COUNT(*) FROM master_spesialis');
  if (Number(spCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO master_spesialis (nama_spesialis) VALUES
        ('Penyakit Dalam'), ('Anak'), ('Bedah'), ('Jantung'), ('Kebidanan'),
        ('Mata'), ('THT'), ('Kulit'), ('Gigi'), ('Umum')
    `);
    console.log('Master spesialis seeded.');
  }

  const jfCount = await pool.query('SELECT COUNT(*) FROM master_jenis_fasilitas');
  if (Number(jfCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO master_jenis_fasilitas (nama_jenis) VALUES
        ('ICU'), ('UGD'), ('Ambulans'), ('Farmasi'), ('Laboratorium'),
        ('Radiologi'), ('Rawat Inap'), ('Poliklinik'), ('Apotek'), ('Hemodialisa')
    `);
    console.log('Master jenis fasilitas seeded.');
  }

  const adminExists = await pool.query(
    "SELECT id FROM users WHERE email = 'admin@healthmapbali.id'"
  );
  if (adminExists.rows.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (nama, email, password, role) VALUES ($1, $2, $3, $4)`,
      ['Administrator', 'admin@healthmapbali.id', hash, 'admin']
    );
    console.log('Admin user seeded (admin@healthmapbali.id / admin123).');
  }

  await pool.end();
  console.log('Seed completed.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function seed() {
  const kategoriCount = await pool.query('SELECT COUNT(*) FROM kategori');
  if (Number(kategoriCount.rows[0].count) === 0) {
    const rsSchema = JSON.stringify([
      { name: 'tipe_rs', label: 'Tipe RS', type: 'select', options: ['Umum', 'Khusus'] },
      { name: 'kelas_rs', label: 'Kelas RS', type: 'select', options: ['A', 'B', 'C', 'D'] },
      { name: 'bpjs', label: 'Layanan BPJS', type: 'select', options: ['Ya', 'Tidak'] },
      { name: 'igd', label: 'IGD', type: 'select', options: ['Tersedia', 'Tidak Tersedia'] },
      { name: 'icu', label: 'ICU', type: 'select', options: ['Tersedia', 'Tidak Tersedia'] },
      { name: 'ambulance', label: 'Ambulans', type: 'select', options: ['Tersedia', 'Tidak Tersedia'] },
      { name: 'jumlah_dokter', label: 'Jumlah Dokter', type: 'number' },
      { name: 'jumlah_bed', label: 'Jumlah Tempat Tidur (Bed)', type: 'number' },
      { name: 'spesialis', label: 'Spesialisasi Utama', type: 'text' },
      { name: 'apotek_internal', label: 'Apotek Internal', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'laboratorium', label: 'Laboratorium', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'ruang_operasi', label: 'Ruang Operasi', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'website', label: 'Website', type: 'text' },
      { name: 'parkir', label: 'Fasilitas Parkir', type: 'select', options: ['Luas', 'Kecil'] }
    ]);
    const klinikSchema = JSON.stringify([
      { name: 'jenis_klinik', label: 'Jenis Klinik', type: 'select', options: ['Umum', 'Gigi', 'Kecantikan'] },
      { name: 'dokter_jaga', label: 'Dokter Jaga', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'bpjs', label: 'Layanan BPJS', type: 'select', options: ['Ya', 'Tidak'] },
      { name: 'layanan_vaksin', label: 'Layanan Vaksin', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'layanan_lab', label: 'Layanan Laboratorium', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'praktek_dokter', label: 'Jadwal Praktek Dokter', type: 'text' },
      { name: 'reservasi_online', label: 'Reservasi Online', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'konsultasi_online', label: 'Konsultasi Online', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'jumlah_ruangan', label: 'Jumlah Ruangan', type: 'number' }
    ]);
    const puskesmasSchema = JSON.stringify([
      { name: 'rawat_inap', label: 'Rawat Inap', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'layanan_ibu_anak', label: 'Layanan Ibu & Anak', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'vaksinasi', label: 'Layanan Vaksinasi', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'poli_umum', label: 'Poli Umum', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'poli_gigi', label: 'Poli Gigi', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'ambulance', label: 'Ambulans', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'cakupan_wilayah', label: 'Cakupan Wilayah', type: 'text' },
      { name: 'program_kesehatan', label: 'Program Kesehatan', type: 'text' }
    ]);
    const apotekSchema = JSON.stringify([
      { name: 'apoteker_jaga', label: 'Apoteker Jaga', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'resep_dokter', label: 'Melayani Resep Dokter', type: 'select', options: ['Dilayani', 'Tidak Dilayani'] },
      { name: 'obat_24_jam', label: 'Sedia Obat 24 Jam', type: 'select', options: ['Ya', 'Tidak'] },
      { name: 'layanan_antar', label: 'Layanan Antar', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'konsultasi_obat', label: 'Konsultasi Obat', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'stok_obat', label: 'Stok Obat', type: 'select', options: ['Lengkap', 'Sedang', 'Terbatas'] },
      { name: 'alat_kesehatan', label: 'Sedia Alat Kesehatan', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'vaksin', label: 'Sedia Vaksin', type: 'select', options: ['Ada', 'Tidak Ada'] }
    ]);
    const labSchema = JSON.stringify([
      { name: 'jenis_pemeriksaan', label: 'Jenis Pemeriksaan', type: 'text' },
      { name: 'hasil_online', label: 'Hasil Online', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'drive_thru', label: 'Layanan Drive Thru', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'home_service', label: 'Layanan Home Service', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'rapid_test', label: 'Layanan Rapid Test', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'pcr_test', label: 'Layanan PCR Test', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'waktu_hasil', label: 'Waktu Keluar Hasil', type: 'text' }
    ]);
    const dokterSchema = JSON.stringify([
      { name: 'nama_dokter', label: 'Nama Dokter', type: 'text' },
      { name: 'spesialisasi', label: 'Spesialisasi', type: 'text' },
      { name: 'nomor_STR', label: 'Nomor STR', type: 'text' },
      { name: 'jadwal_praktik', label: 'Jadwal Praktik', type: 'text' },
      { name: 'pengalaman', label: 'Pengalaman', type: 'text' },
      { name: 'konsultasi_online', label: 'Konsultasi Online', type: 'select', options: ['Ada', 'Tidak Ada'] },
      { name: 'biaya_konsultasi', label: 'Biaya Konsultasi', type: 'number' }
    ]);

    await pool.query(`
      INSERT INTO kategori (nama_kategori, icon_marker, warna_marker, skema_atribut) VALUES
        ('Rumah Sakit',    'hospital',  '#EF4444', $1),
        ('Klinik',         'clinic',    '#3B82F6', $2),
        ('Puskesmas',      'puskesmas', '#EAB308', $3),
        ('Apotek',         'pharmacy',  '#22C55E', $4),
        ('Laboratorium',   'lab',       '#A855F7', $5),
        ('UGD 24 Jam',     'emergency', '#F97316', '[]'::jsonb),
        ('Dokter Praktik', 'doctor',    '#06B6D4', $6),
        ('Ambulans',       'ambulance', '#DC2626', '[]'::jsonb)
    `, [rsSchema, klinikSchema, puskesmasSchema, apotekSchema, labSchema, dokterSchema]);
    console.log('Kategori seeded (8 rows with schema definitions).');
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

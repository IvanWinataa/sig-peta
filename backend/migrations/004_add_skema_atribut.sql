ALTER TABLE kategori ADD COLUMN IF NOT EXISTS skema_atribut JSONB;

UPDATE kategori SET skema_atribut = '[
  {"name": "tipe_rs", "label": "Tipe RS", "type": "select", "options": ["Umum", "Khusus"]},
  {"name": "kelas_rs", "label": "Kelas RS", "type": "select", "options": ["A", "B", "C", "D"]},
  {"name": "bpjs", "label": "Layanan BPJS", "type": "select", "options": ["Ya", "Tidak"]},
  {"name": "igd", "label": "IGD", "type": "select", "options": ["Tersedia", "Tidak Tersedia"]},
  {"name": "icu", "label": "ICU", "type": "select", "options": ["Tersedia", "Tidak Tersedia"]},
  {"name": "ambulance", "label": "Ambulans", "type": "select", "options": ["Tersedia", "Tidak Tersedia"]},
  {"name": "jumlah_dokter", "label": "Jumlah Dokter", "type": "number"},
  {"name": "jumlah_bed", "label": "Jumlah Tempat Tidur (Bed)", "type": "number"},
  {"name": "spesialis", "label": "Spesialisasi Utama", "type": "text"},
  {"name": "apotek_internal", "label": "Apotek Internal", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "laboratorium", "label": "Laboratorium", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "ruang_operasi", "label": "Ruang Operasi", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "website", "label": "Website", "type": "text"},
  {"name": "parkir", "label": "Fasilitas Parkir", "type": "select", "options": ["Luas", "Kecil"]}
]'::jsonb WHERE nama_kategori = 'Rumah Sakit';

UPDATE kategori SET skema_atribut = '[
  {"name": "jenis_klinik", "label": "Jenis Klinik", "type": "select", "options": ["Umum", "Gigi", "Kecantikan"]},
  {"name": "dokter_jaga", "label": "Dokter Jaga", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "bpjs", "label": "Layanan BPJS", "type": "select", "options": ["Ya", "Tidak"]},
  {"name": "layanan_vaksin", "label": "Layanan Vaksin", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "layanan_lab", "label": "Layanan Laboratorium", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "praktek_dokter", "label": "Jadwal Praktek Dokter", "type": "text"},
  {"name": "reservasi_online", "label": "Reservasi Online", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "konsultasi_online", "label": "Konsultasi Online", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "jumlah_ruangan", "label": "Jumlah Ruangan", "type": "number"}
]'::jsonb WHERE nama_kategori = 'Klinik';

UPDATE kategori SET skema_atribut = '[
  {"name": "rawat_inap", "label": "Rawat Inap", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "layanan_ibu_anak", "label": "Layanan Ibu & Anak", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "vaksinasi", "label": "Layanan Vaksinasi", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "poli_umum", "label": "Poli Umum", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "poli_gigi", "label": "Poli Gigi", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "ambulance", "label": "Ambulans", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "cakupan_wilayah", "label": "Cakupan Wilayah", "type": "text"},
  {"name": "program_kesehatan", "label": "Program Kesehatan", "type": "text"}
]'::jsonb WHERE nama_kategori = 'Puskesmas';

UPDATE kategori SET skema_atribut = '[
  {"name": "apoteker_jaga", "label": "Apoteker Jaga", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "resep_dokter", "label": "Melayani Resep Dokter", "type": "select", "options": ["Dilayani", "Tidak Dilayani"]},
  {"name": "obat_24_jam", "label": "Sedia Obat 24 Jam", "type": "select", "options": ["Ya", "Tidak"]},
  {"name": "layanan_antar", "label": "Layanan Antar", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "konsultasi_obat", "label": "Konsultasi Obat", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "stok_obat", "label": "Stok Obat", "type": "select", "options": ["Lengkap", "Sedang", "Terbatas"]},
  {"name": "alat_kesehatan", "label": "Sedia Alat Kesehatan", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "vaksin", "label": "Sedia Vaksin", "type": "select", "options": ["Ada", "Tidak Ada"]}
]'::jsonb WHERE nama_kategori = 'Apotek';

UPDATE kategori SET skema_atribut = '[
  {"name": "jenis_pemeriksaan", "label": "Jenis Pemeriksaan", "type": "text"},
  {"name": "hasil_online", "label": "Hasil Online", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "drive_thru", "label": "Layanan Drive Thru", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "home_service", "label": "Layanan Home Service", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "rapid_test", "label": "Layanan Rapid Test", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "pcr_test", "label": "Layanan PCR Test", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "waktu_hasil", "label": "Waktu Keluar Hasil", "type": "text"}
]'::jsonb WHERE nama_kategori = 'Laboratorium';

UPDATE kategori SET skema_atribut = '[
  {"name": "nama_dokter", "label": "Nama Dokter", "type": "text"},
  {"name": "spesialisasi", "label": "Spesialisasi", "type": "text"},
  {"name": "nomor_STR", "label": "Nomor STR", "type": "text"},
  {"name": "jadwal_praktik", "label": "Jadwal Praktik", "type": "text"},
  {"name": "pengalaman", "label": "Pengalaman", "type": "text"},
  {"name": "konsultasi_online", "label": "Konsultasi Online", "type": "select", "options": ["Ada", "Tidak Ada"]},
  {"name": "biaya_konsultasi", "label": "Biaya Konsultasi", "type": "number"}
]'::jsonb WHERE nama_kategori = 'Dokter Praktik';

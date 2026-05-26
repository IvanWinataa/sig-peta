UPDATE kategori SET skema_atribut = '[
  {"name": "tipe_rs", "label": "Tipe RS", "type": "text"},
  {"name": "kelas_rs", "label": "Kelas RS", "type": "text"},
  {"name": "bpjs", "label": "Layanan BPJS", "type": "text"},
  {"name": "igd", "label": "IGD", "type": "text"},
  {"name": "icu", "label": "ICU", "type": "text"},
  {"name": "ambulance", "label": "Ambulans", "type": "text"},
  {"name": "jumlah_dokter", "label": "Jumlah Dokter", "type": "number"},
  {"name": "jumlah_bed", "label": "Jumlah Tempat Tidur (Bed)", "type": "number"},
  {"name": "spesialis", "label": "Spesialisasi Utama (Dokter)", "type": "spesialis_list"},
  {"name": "fasilitas", "label": "Fasilitas Tersedia (List)", "type": "fasilitas_list"},
  {"name": "apotek_internal", "label": "Apotek Internal", "type": "text"},
  {"name": "laboratorium", "label": "Laboratorium", "type": "text"},
  {"name": "ruang_operasi", "label": "Ruang Operasi", "type": "text"},
  {"name": "website", "label": "Website", "type": "text"},
  {"name": "parkir", "label": "Fasilitas Parkir", "type": "text"}
]'::jsonb WHERE nama_kategori = 'Rumah Sakit';

UPDATE kategori SET skema_atribut = '[
  {"name": "jenis_klinik", "label": "Jenis Klinik", "type": "text"},
  {"name": "dokter_jaga", "label": "Dokter Jaga", "type": "text"},
  {"name": "bpjs", "label": "Layanan BPJS", "type": "text"},
  {"name": "layanan_vaksin", "label": "Layanan Vaksin", "type": "text"},
  {"name": "layanan_lab", "label": "Layanan Laboratorium", "type": "text"},
  {"name": "praktek_dokter", "label": "Jadwal Praktek Dokter", "type": "text"},
  {"name": "reservasi_online", "label": "Reservasi Online", "type": "text"},
  {"name": "konsultasi_online", "label": "Konsultasi Online", "type": "text"},
  {"name": "jumlah_ruangan", "label": "Jumlah Ruangan", "type": "number"}
]'::jsonb WHERE nama_kategori = 'Klinik';

UPDATE kategori SET skema_atribut = '[
  {"name": "rawat_inap", "label": "Rawat Inap", "type": "text"},
  {"name": "layanan_ibu_anak", "label": "Layanan Ibu & Anak", "type": "text"},
  {"name": "vaksinasi", "label": "Layanan Vaksinasi", "type": "text"},
  {"name": "poli_umum", "label": "Poli Umum", "type": "text"},
  {"name": "poli_gigi", "label": "Poli Gigi", "type": "text"},
  {"name": "ambulance", "label": "Ambulans", "type": "text"},
  {"name": "cakupan_wilayah", "label": "Cakupan Wilayah", "type": "text"},
  {"name": "program_kesehatan", "label": "Program Kesehatan", "type": "text"}
]'::jsonb WHERE nama_kategori = 'Puskesmas';

UPDATE kategori SET skema_atribut = '[
  {"name": "apoteker_jaga", "label": "Apoteker Jaga", "type": "text"},
  {"name": "resep_dokter", "label": "Melayani Resep Dokter", "type": "text"},
  {"name": "obat_24_jam", "label": "Sedia Obat 24 Jam", "type": "text"},
  {"name": "layanan_antar", "label": "Layanan Antar", "type": "text"},
  {"name": "konsultasi_obat", "label": "Konsultasi Obat", "type": "text"},
  {"name": "stok_obat", "label": "Stok Obat", "type": "text"},
  {"name": "alat_kesehatan", "label": "Sedia Alat Kesehatan", "type": "text"},
  {"name": "vaksin", "label": "Sedia Vaksin", "type": "text"}
]'::jsonb WHERE nama_kategori = 'Apotek';

UPDATE kategori SET skema_atribut = '[
  {"name": "jenis_pemeriksaan", "label": "Jenis Pemeriksaan", "type": "text"},
  {"name": "hasil_online", "label": "Hasil Online", "type": "text"},
  {"name": "drive_thru", "label": "Layanan Drive Thru", "type": "text"},
  {"name": "home_service", "label": "Layanan Home Service", "type": "text"},
  {"name": "rapid_test", "label": "Layanan Rapid Test", "type": "text"},
  {"name": "pcr_test", "label": "Layanan PCR Test", "type": "text"},
  {"name": "waktu_hasil", "label": "Waktu Keluar Hasil", "type": "text"}
]'::jsonb WHERE nama_kategori = 'Laboratorium';

UPDATE kategori SET skema_atribut = '[
  {"name": "nama_dokter", "label": "Nama Dokter", "type": "text"},
  {"name": "spesialisasi", "label": "Spesialisasi", "type": "text"},
  {"name": "nomor_STR", "label": "Nomor STR", "type": "text"},
  {"name": "jadwal_praktik", "label": "Jadwal Praktik", "type": "text"},
  {"name": "pengalaman", "label": "Pengalaman", "type": "text"},
  {"name": "konsultasi_online", "label": "Konsultasi Online", "type": "text"},
  {"name": "biaya_konsultasi", "label": "Biaya Konsultasi", "type": "number"}
]'::jsonb WHERE nama_kategori = 'Dokter Praktik';

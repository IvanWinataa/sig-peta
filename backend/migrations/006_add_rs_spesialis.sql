UPDATE kategori SET skema_atribut = '[
  {"name": "tipe_rs", "label": "Tipe RS", "type": "text"},
  {"name": "kelas_rs", "label": "Kelas RS", "type": "text"},
  {"name": "bpjs", "label": "Layanan BPJS", "type": "text"},
  {"name": "igd", "label": "IGD", "type": "text"},
  {"name": "icu", "label": "ICU", "type": "text"},
  {"name": "ambulance", "label": "Ambulans", "type": "text"},
  {"name": "jumlah_dokter", "label": "Jumlah Dokter", "type": "number"},
  {"name": "jumlah_bed", "label": "Jumlah Tempat Tidur (Bed)", "type": "number"},
  {"name": "spesialis", "label": "Dokter Spesialis", "type": "spesialis_list"},
  {"name": "apotek_internal", "label": "Apotek Internal", "type": "text"},
  {"name": "laboratorium", "label": "Laboratorium", "type": "text"},
  {"name": "ruang_operasi", "label": "Ruang Operasi", "type": "text"},
  {"name": "website", "label": "Website", "type": "text"},
  {"name": "parkir", "label": "Fasilitas Parkir", "type": "text"}
]'::jsonb WHERE nama_kategori = 'Rumah Sakit';

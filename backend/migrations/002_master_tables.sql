CREATE TABLE IF NOT EXISTS master_spesialis (
  id             SERIAL PRIMARY KEY,
  nama_spesialis VARCHAR(150) NOT NULL UNIQUE,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master_jenis_fasilitas (
  id         SERIAL PRIMARY KEY,
  nama_jenis VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

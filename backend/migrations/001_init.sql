CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  nama        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'user'
              CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS kategori (
  id            SERIAL PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL UNIQUE,
  icon_marker   VARCHAR(50)  NOT NULL,
  warna_marker  VARCHAR(20)  NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fasilitas_kesehatan (
  id                SERIAL PRIMARY KEY,
  nama_fasilitas    VARCHAR(255) NOT NULL,
  kategori_id       INTEGER NOT NULL REFERENCES kategori(id) ON DELETE RESTRICT,
  alamat            TEXT NOT NULL,
  latitude          DECIMAL(10, 8) NOT NULL,
  longitude         DECIMAL(11, 8) NOT NULL,
  no_telepon        VARCHAR(20),
  email             VARCHAR(100),
  jam_operasional   VARCHAR(100),
  status_24_jam     BOOLEAN NOT NULL DEFAULT FALSE,
  bpjs              BOOLEAN NOT NULL DEFAULT FALSE,
  dokter_spesialis  TEXT,
  fasilitas         TEXT,
  deskripsi         TEXT,
  rating            DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
  foto              VARCHAR(500),
  created_by        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fasilitas_kategori ON fasilitas_kesehatan(kategori_id);
CREATE INDEX IF NOT EXISTS idx_fasilitas_created_by ON fasilitas_kesehatan(created_by);
CREATE INDEX IF NOT EXISTS idx_fasilitas_coords ON fasilitas_kesehatan(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_fasilitas_nama ON fasilitas_kesehatan(nama_fasilitas);

# 05 — DATABASE SCHEMA

## HealthMap Bali — PostgreSQL Schema

**DBMS:** PostgreSQL 14+  
**Database name:** `healthmap_bali`

---

## 1. Entity Relationship Diagram

```mermaid
erDiagram
  users ||--o{ fasilitas_kesehatan : creates
  kategori ||--o{ fasilitas_kesehatan : categorizes

  users {
    serial id PK
    varchar nama
    varchar email UK
    varchar password
    varchar role
    timestamp created_at
  }

  kategori {
    serial id PK
    varchar nama_kategori UK
    varchar icon_marker
    varchar warna_marker
    timestamp created_at
  }

  fasilitas_kesehatan {
    serial id PK
    varchar nama_fasilitas
    int kategori_id FK
    text alamat
    decimal latitude
    decimal longitude
    varchar no_telepon
    varchar email
    varchar jam_operasional
    boolean status_24_jam
    boolean bpjs
    text dokter_spesialis
    text fasilitas
    text deskripsi
    decimal rating
    varchar foto
    int created_by FK
    timestamp created_at
  }
```

---

## 2. DDL — Create Tables

### 2.1 Tabel `users`

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  nama        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'user'
              CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2.2 Tabel `kategori` (Master Data)

```sql
CREATE TABLE kategori (
  id            SERIAL PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL UNIQUE,
  icon_marker   VARCHAR(50)  NOT NULL,
  warna_marker  VARCHAR(20)  NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2.3 Tabel `fasilitas_kesehatan`

```sql
CREATE TABLE fasilitas_kesehatan (
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

CREATE INDEX idx_fasilitas_kategori ON fasilitas_kesehatan(kategori_id);
CREATE INDEX idx_fasilitas_created_by ON fasilitas_kesehatan(created_by);
CREATE INDEX idx_fasilitas_coords ON fasilitas_kesehatan(latitude, longitude);
CREATE INDEX idx_fasilitas_nama ON fasilitas_kesehatan(nama_fasilitas);
```

---

## 3. Relasi dan Constraint

| Relasi | Dari | Ke | On Delete |
|--------|------|-----|-----------|
| FK kategori | `fasilitas_kesehatan.kategori_id` | `kategori.id` | RESTRICT |
| FK pembuat | `fasilitas_kesehatan.created_by` | `users.id` | CASCADE |

**RESTRICT pada kategori:** Admin tidak bisa hapus kategori yang masih memiliki fasilitas.

---

## 4. Seed Data — Kategori (8 baris)

```sql
INSERT INTO kategori (nama_kategori, icon_marker, warna_marker) VALUES
  ('Rumah Sakit',    'hospital',  '#EF4444'),
  ('Klinik',         'clinic',    '#3B82F6'),
  ('Puskesmas',      'puskesmas', '#EAB308'),
  ('Apotek',         'pharmacy',  '#22C55E'),
  ('Laboratorium',   'lab',       '#A855F7'),
  ('UGD 24 Jam',     'emergency', '#F97316'),
  ('Dokter Praktik', 'doctor',    '#06B6D4'),
  ('Ambulans',       'ambulance', '#DC2626');
```

---

## 5. Seed Data — Admin Default

```sql
-- Password: admin123 (hash dengan bcrypt, cost 10)
-- Ganti hash ini saat implementasi dengan bcrypt.hashSync('admin123', 10)
INSERT INTO users (nama, email, password, role) VALUES
  ('Administrator', 'admin@healthmapbali.id', '$2a$10$PLACEHOLDER_HASH', 'admin');
```

---

## 6. Contoh Query Penting

### 6.1 Public — Semua fasilitas dengan join kategori

```sql
SELECT
  f.*,
  k.nama_kategori,
  k.icon_marker,
  k.warna_marker
FROM fasilitas_kesehatan f
JOIN kategori k ON k.id = f.kategori_id
ORDER BY f.nama_fasilitas ASC;
```

### 6.2 Public — Filter + Search + Pagination

```sql
SELECT f.*, k.nama_kategori, k.warna_marker, k.icon_marker
FROM fasilitas_kesehatan f
JOIN kategori k ON k.id = f.kategori_id
WHERE ($1::int IS NULL OR f.kategori_id = $1)
  AND ($2::text IS NULL OR (
    f.nama_fasilitas ILIKE '%' || $2 || '%'
    OR f.alamat ILIKE '%' || $2 || '%'
    OR k.nama_kategori ILIKE '%' || $2 || '%'
  ))
ORDER BY f.nama_fasilitas ASC
LIMIT $3 OFFSET $4;
```

### 6.3 Private — Marker milik user

```sql
SELECT f.*, k.nama_kategori
FROM fasilitas_kesehatan f
JOIN kategori k ON k.id = f.kategori_id
WHERE f.created_by = $1
ORDER BY f.created_at DESC;
```

### 6.4 Ownership check

```sql
SELECT created_by FROM fasilitas_kesehatan WHERE id = $1;
```

---

## 7. Mapping Field API ↔ Database

| API JSON key | DB column | Tipe |
|--------------|-----------|------|
| `id` | `id` | SERIAL |
| `nama_fasilitas` | `nama_fasilitas` | VARCHAR |
| `kategori_id` | `kategori_id` | INTEGER FK |
| `nama_kategori` | join `kategori.nama_kategori` | — |
| `alamat` | `alamat` | TEXT |
| `latitude` | `latitude` | DECIMAL |
| `longitude` | `longitude` | DECIMAL |
| `no_telepon` | `no_telepon` | VARCHAR |
| `email` | `email` | VARCHAR |
| `jam_operasional` | `jam_operasional` | VARCHAR |
| `status_24_jam` | `status_24_jam` | BOOLEAN |
| `bpjs` | `bpjs` | BOOLEAN |
| `dokter_spesialis` | `dokter_spesialis` | TEXT |
| `fasilitas` | `fasilitas` | TEXT |
| `deskripsi` | `deskripsi` | TEXT |
| `rating` | `rating` | DECIMAL |
| `foto` | `foto` | VARCHAR |
| `created_by` | `created_by` | INTEGER FK |
| `created_at` | `created_at` | TIMESTAMP |

---

## 8. Validasi Koordinat (Application Layer)

| Field | Rule |
|-------|------|
| `latitude` | Antara `-8.9` dan `-8.0` (kawasan Bali, bisa dilonggarkan) |
| `longitude` | Antara `114.4` dan `115.8` |
| `rating` | 0.0 – 5.0 |
| `status_24_jam` | boolean |
| `bpjs` | boolean |

---

## 9. Migration File Structure

```
backend/migrations/
  001_create_users.sql
  002_create_kategori.sql
  003_create_fasilitas_kesehatan.sql
backend/seeds/
  001_seed_kategori.sql
  002_seed_admin.sql
```

---

## 10. Environment Connection

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthmap_bali
```

**Buat database:**

```sql
CREATE DATABASE healthmap_bali;
```

---

## 11. Dokumen Terkait

| File | Isi |
|------|-----|
| [04-API-SPECIFICATION.md](./04-API-SPECIFICATION.md) | Endpoint yang menggunakan tabel ini |
| [07-IMPLEMENTATION-GUIDE.md](./07-IMPLEMENTATION-GUIDE.md) | Fase 1: setup database |

---

*Skema ini tidak boleh diubah tanpa update API spec dan project spec.*

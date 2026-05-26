# 04 — API SPECIFICATION

## HealthMap Bali — REST API Reference

**Base URL:** `http://localhost:5000/api`  
**Format:** JSON (`Content-Type: application/json`)  
**Auth header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Response Format Standar

### 1.1 Sukses

```json
{
  "success": true,
  "message": "Pesan opsional",
  "data": { }
}
```

### 1.2 Sukses dengan Pagination

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### 1.3 Error

```json
{
  "success": false,
  "message": "Deskripsi error",
  "errors": [
    { "field": "email", "message": "Email sudah terdaftar" }
  ]
}
```

### 1.4 HTTP Status Codes

| Code | Arti |
|------|------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (token tidak valid / tidak ada) |
| 403 | Forbidden (tidak punya hak akses) |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## 2. Authentication Endpoints

### 2.1 Register

```
POST /api/auth/register
```

**Auth:** Tidak perlu

**Request Body:**

```json
{
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "password": "password123"
}
```

**Response `201`:**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "nama": "Budi Santoso",
    "email": "budi@email.com",
    "role": "user"
  }
}
```

**Validasi:**
- `nama`: required, min 2 karakter
- `email`: required, format email, unique
- `password`: required, min 6 karakter

---

### 2.2 Login

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "budi@email.com",
  "password": "password123"
}
```

**Response `200`:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nama": "Budi Santoso",
      "email": "budi@email.com",
      "role": "user"
    }
  }
}
```

**Error `401`:**

```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

### 2.3 Get Profile (Protected)

```
GET /api/auth/me
```

**Auth:** Bearer token

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nama": "Budi Santoso",
    "email": "budi@email.com",
    "role": "user"
  }
}
```

---

## 3. Public Endpoints (Tanpa Auth)

### 3.1 List Semua Fasilitas

```
GET /api/public/fasilitas
```

**Query Parameters:**

| Param | Tipe | Default | Keterangan |
|-------|------|---------|------------|
| `kategori_id` | integer | — | Filter satu kategori |
| `search` | string | — | Cari nama, alamat, nama kategori |
| `page` | integer | 1 | Halaman (untuk tabel) |
| `limit` | integer | 100 | Jumlah per halaman |
| `sort` | string | `nama_fasilitas` | Kolom sort |
| `order` | string | `asc` | `asc` atau `desc` |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_fasilitas": "RSUD Bali Mandara",
      "kategori_id": 1,
      "nama_kategori": "Rumah Sakit",
      "warna_marker": "#EF4444",
      "icon_marker": "hospital",
      "alamat": "Jl. Bypass Ngurah Rai, Denpasar",
      "latitude": -8.6705,
      "longitude": 115.2126,
      "no_telepon": "0361-123456",
      "email": "info@rsudbali.id",
      "jam_operasional": "24 Jam",
      "status_24_jam": true,
      "bpjs": true,
      "dokter_spesialis": "Penyakit Dalam, Anak, Bedah",
      "fasilitas": "ICU, UGD, Ambulans, Farmasi",
      "deskripsi": "Rumah sakit rujukan utama",
      "rating": 4.5,
      "foto": "/uploads/rsud-bali.jpg",
      "atribut_khusus": {
        "tipe_rs": "Umum",
        "kelas_rs": "A",
        "bpjs": "Ya",
        "igd": "Tersedia",
        "icu": "Tersedia",
        "ambulance": "Tersedia",
        "jumlah_dokter": 50,
        "jumlah_bed": 200,
        "spesialis": [
          { "spesialis_id": 1, "nama_dokter": "dr. Budi, Sp.PD" },
          { "spesialis_id": 2, "nama_dokter": "dr. Ani, Sp.A" }
        ],
        "fasilitas": [
          { "jenis_id": 1, "keterangan": "2 Unit" },
          { "jenis_id": 2, "keterangan": "24 Jam" }
        ],
        "apotek_internal": "Ada",
        "laboratorium": "Ada",
        "ruang_operasi": "Ada",
        "website": "https://rsudbalimandara.id",
        "parkir": "Luas"
      },
      "created_by": 2,
      "created_at": "2026-01-15T08:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 100,
    "total": 1,
    "totalPages": 1
  }
}
```

**Catatan:** Endpoint ini mengembalikan **SEMUA** fasilitas dari semua user.

---

### 3.2 Detail Fasilitas

```
GET /api/public/fasilitas/:id
```

**Response `200`:** Object fasilitas tunggal (struktur sama seperti item di list).

**Response `404`:**

```json
{
  "success": false,
  "message": "Fasilitas tidak ditemukan"
}
```

---

### 3.3 List Kategori (Master)

```
GET /api/public/kategori
```

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_kategori": "Rumah Sakit",
      "icon_marker": "hospital",
      "warna_marker": "#EF4444",
      "skema_atribut": [
        { "name": "tipe_rs", "label": "Tipe RS", "type": "select", "options": ["Umum", "Khusus"] }
      ]
    },
    {
      "id": 2,
      "nama_kategori": "Klinik",
      "icon_marker": "clinic",
      "warna_marker": "#3B82F6",
      "skema_atribut": [
        { "name": "jenis_klinik", "label": "Jenis Klinik", "type": "select", "options": ["Umum", "Gigi", "Kecantikan"] }
      ]
    }
  ]
}
```

---

### 3.4 List Master Spesialis

```
GET /api/public/spesialis
```

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_spesialis": "Penyakit Dalam"
    }
  ]
}
```

---

### 3.5 List Master Jenis Fasilitas

```
GET /api/public/jenis-fasilitas
```

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_fasilitas": "ICU"
    }
  ]
}
```

---

## 4. Private Endpoints (JWT Required)

**Role yang diizinkan:** `user`, `admin`

### 4.1 Tambah Fasilitas

```
POST /api/private/fasilitas
```

**Content-Type:** `multipart/form-data` (jika ada foto) atau `application/json`

**Request Body (JSON):**

```json
{
  "nama_fasilitas": "Klinik Sehat Bali",
  "kategori_id": 2,
  "alamat": "Jl. Raya Kuta No. 10",
  "latitude": -8.7177,
  "longitude": 115.1682,
  "no_telepon": "0361-999888",
  "email": "info@kliniksehat.id",
  "jam_operasional": "08:00 - 20:00",
  "status_24_jam": false,
  "bpjs": true,
  "dokter_spesialis": "Umum, Gigi",
  "fasilitas": "Laboratorium, Farmasi",
  "deskripsi": "Klinik umum dekat pantai",
  "rating": 4.0,
  "atribut_khusus": "{\"jenis_klinik\":\"Umum\",\"dokter_jaga\":\"Ada\",\"bpjs\":\"Ya\",\"layanan_vaksin\":\"Ada\",\"layanan_lab\":\"Ada\",\"praktek_dokter\":\"Senin - Sabtu\",\"reservasi_online\":\"Ada\",\"konsultasi_online\":\"Ada\",\"jumlah_ruangan\":5}"
}
```

**Multipart fields:** `foto` (file image: jpg, png, max 2MB)

**Response `201`:**

```json
{
  "success": true,
  "message": "Fasilitas berhasil ditambahkan",
  "data": { "id": 5, "nama_fasilitas": "Klinik Sehat Bali", "...": "..." }
}
```

**Backend wajib set:** `created_by = req.user.id`, `created_at = NOW()`

---

### 4.2 Update Fasilitas

```
PUT /api/private/fasilitas/:id
```

**Ownership:** Hanya pemilik (`created_by === req.user.id`) atau admin.

**Request Body:** Sama seperti POST (field partial update diizinkan).

**Response `200`:** Data fasilitas terupdate.

**Response `403`:**

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk mengedit fasilitas ini"
}
```

---

### 4.3 Hapus Fasilitas

```
DELETE /api/private/fasilitas/:id
```

**Ownership:** Sama seperti PUT.

**Response `200`:**

```json
{
  "success": true,
  "message": "Fasilitas berhasil dihapus"
}
```

---

### 4.4 Marker Milik User

```
GET /api/private/my-fasilitas
```

**Filter:** `WHERE created_by = req.user.id`

**Query Parameters:** `search`, `page`, `limit`, `sort`, `order`

**Response `200`:** List fasilitas (hanya milik user login).

---

## 5. Admin Endpoints (JWT + role=admin)

### 5.1 List Semua Fasilitas (Admin)

```
GET /api/admin/all-fasilitas
```

**Response:** Semua fasilitas + info pembuat (`created_by`, `nama_pembuat`).

---

### 5.2 Hapus Fasilitas (Admin)

```
DELETE /api/admin/fasilitas/:id
```

Tanpa ownership check.

---

### 5.3 CRUD Kategori

| Method | Endpoint | Aksi |
|--------|----------|------|
| GET | `/api/admin/kategori` | List semua |
| GET | `/api/admin/kategori/:id` | Detail |
| POST | `/api/admin/kategori` | Tambah |
| PUT | `/api/admin/kategori/:id` | Update |
| DELETE | `/api/admin/kategori/:id` | Hapus |

**POST Body:**

```json
{
  "nama_kategori": "Rumah Sakit",
  "icon_marker": "hospital",
  "warna_marker": "#EF4444",
  "skema_atribut": [
    { "name": "tipe_rs", "label": "Tipe RS", "type": "select", "options": ["Umum", "Khusus"] },
    { "name": "kelas_rs", "label": "Kelas RS", "type": "select", "options": ["A", "B", "C", "D"] }
  ]
}
```

**DELETE constraint:** Tidak boleh hapus kategori yang masih dipakai fasilitas (return `400`).

---

### 5.4 CRUD Spesialis & Jenis Fasilitas

**Spesialis:**
| Method | Endpoint | Aksi |
|--------|----------|------|
| GET | `/api/admin/spesialis` | List semua |
| GET | `/api/admin/spesialis/:id` | Detail |
| POST | `/api/admin/spesialis` | Tambah |
| PUT | `/api/admin/spesialis/:id` | Update |
| DELETE | `/api/admin/spesialis/:id` | Hapus |

**Jenis Fasilitas:**
| Method | Endpoint | Aksi |
|--------|----------|------|
| GET | `/api/admin/jenis-fasilitas` | List semua |
| GET | `/api/admin/jenis-fasilitas/:id` | Detail |
| POST | `/api/admin/jenis-fasilitas` | Tambah |
| PUT | `/api/admin/jenis-fasilitas/:id` | Update |
| DELETE | `/api/admin/jenis-fasilitas/:id` | Hapus |

---

### 5.5 CRUD User

| Method | Endpoint | Aksi |
|--------|----------|------|
| GET | `/api/admin/users` | List semua user |
| GET | `/api/admin/users/:id` | Detail user |
| PUT | `/api/admin/users/:id` | Update role/nama |
| DELETE | `/api/admin/users/:id` | Hapus user |

**PUT Body (contoh ubah role):**

```json
{
  "nama": "Budi Santoso",
  "role": "admin"
}
```

---

## 6. Ringkasan Semua Endpoint

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/auth/register` | — | — |
| POST | `/auth/login` | — | — |
| GET | `/auth/me` | JWT | any |
| GET | `/public/fasilitas` | — | — |
| GET | `/public/fasilitas/:id` | — | — |
| GET | `/public/kategori` | — | — |
| GET | `/public/spesialis` | — | — |
| GET | `/public/jenis-fasilitas` | — | — |
| POST | `/private/fasilitas` | JWT | user, admin |
| PUT | `/private/fasilitas/:id` | JWT | owner/admin |
| DELETE | `/private/fasilitas/:id` | JWT | owner/admin |
| GET | `/private/my-fasilitas` | JWT | user, admin |
| GET | `/admin/all-fasilitas` | JWT | admin |
| DELETE | `/admin/fasilitas/:id` | JWT | admin |
| GET/POST/PUT/DELETE | `/admin/kategori` | JWT | admin |
| GET/POST/PUT/DELETE | `/admin/spesialis` | JWT | admin |
| GET/POST/PUT/DELETE | `/admin/jenis-fasilitas` | JWT | admin |
| GET/PUT/DELETE | `/admin/users` | JWT | admin |

---

## 7. Middleware Implementation Notes

### 7.1 authenticate

```javascript
// Ekstrak token dari header
const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
// jwt.verify → set req.user = { id, email, role }
```

### 7.2 requireAdmin

```javascript
if (req.user.role !== 'admin') {
  return res.status(403).json({ success: false, message: 'Akses admin diperlukan' });
}
```

### 7.3 checkOwnership (untuk PUT/DELETE private)

```javascript
const fasilitas = await getFasilitasById(req.params.id);
if (!fasilitas) return res.status(404).json(...);
if (req.user.role !== 'admin' && fasilitas.created_by !== req.user.id) {
  return res.status(403).json(...);
}
```

---

## 8. Upload Foto

| Aturan | Nilai |
|--------|-------|
| Field name | `foto` |
| Tipe file | `image/jpeg`, `image/png`, `image/webp` |
| Max size | 2 MB |
| Storage | `backend/uploads/` |
| DB value | `/uploads/nama-file.jpg` |
| Serve static | `app.use('/uploads', express.static('uploads'))` |

---

## 9. CORS Configuration

```javascript
cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
})
```

---

## 10. Dokumen Terkait

| File | Isi |
|------|-----|
| [05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md) | Struktur tabel |
| [03-SYSTEM-FLOW.md](./03-SYSTEM-FLOW.md) | Kapan endpoint dipanggil |

---

*Jangan menambah endpoint di luar tabel di Section 6 tanpa update dokumen ini.*

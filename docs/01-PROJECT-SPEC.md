# 01 — PROJECT SPECIFICATION

## HealthMap Bali: WebGIS Fasilitas Kesehatan dengan Navigasi dan Multi User

**Versi dokumen:** 1.0  
**Status:** Acuan pengembangan — wajib dibaca sebelum coding  
**Stack:** React (Vite) + Tailwind + Leaflet | Node.js Express + PostgreSQL + JWT

---

## 1. Tujuan Sistem

Membangun **Sistem Informasi Geografis (SIG) berbasis web** yang berfokus **hanya** pada rumpun **Fasilitas Kesehatan di Bali**, dari sudut pandang pengguna (masyarakat, mahasiswa rantau, wisatawan, admin fasilitas).

Sistem digunakan untuk:

| No | Fungsi |
|----|--------|
| 1 | Mencari fasilitas kesehatan |
| 2 | Melihat lokasi fasilitas pada peta interaktif |
| 3 | Mengelola marker fasilitas (multi user) |
| 4 | Melihat informasi detail fasilitas |
| 5 | Navigasi/rute menuju lokasi fasilitas |

Sistem **wajib** memiliki: backend API, authentication JWT, endpoint public & private, multi user, marker cluster, route navigation, lokasi user, tampilan spasial **dan** tabular.

---

## 2. Scope Sistem

### 2.1 IN SCOPE (boleh dikembangkan)

- Satu rumpun: **Fasilitas Kesehatan**
- Banyak kategori dalam rumpun tersebut (master data)
- Peta Bali dengan marker fasilitas kesehatan
- Halaman public (tanpa login)
- Halaman user terdaftar (CRUD marker milik sendiri)
- Halaman admin (kelola semua data, user, kategori)
- API public & private + JWT
- Data tabel (non-spasial)

### 2.2 OUT OF SCOPE (larangan — jangan ditambahkan agen)

| Larangan | Alasan |
|----------|--------|
| Wisata, hotel, kuliner | Bukan rumpun kesehatan |
| Rumah, kantor, sekolah | Di luar fokus proyek |
| Multi rumpun (campur kategori non-kesehatan) | Dosen: 1 rumpun saja |
| Hardcode kategori di frontend | Dosen: master kategori |
| Form tambah/edit di sidebar | Dosen: modal form |
| Marker tanpa cluster | Dosen: wajib cluster |

---

## 3. Rumpun dan Kategori

### 3.1 Rumpun Utama

**Fasilitas Kesehatan** — satu-satunya rumpun dalam sistem.

### 3.2 Kategori Objek (Master Data)

Kategori disimpan di tabel `kategori`, **bukan** di-hardcode di kode.

| No | nama_kategori | Contoh warna marker |
|----|---------------|---------------------|
| 1 | Rumah Sakit | merah (`#EF4444`) |
| 2 | Klinik | biru (`#3B82F6`) |
| 3 | Puskesmas | kuning (`#EAB308`) |
| 4 | Apotek | hijau (`#22C55E`) |
| 5 | Laboratorium | ungu (`#A855F7`) |
| 6 | UGD 24 Jam | oranye (`#F97316`) |
| 7 | Dokter Praktik | cyan (`#06B6D4`) |
| 8 | Ambulans | merah tua (`#DC2626`) |

---

## 4. Atribut Objek Fasilitas

Setiap record di tabel `fasilitas_kesehatan` memiliki atribut berikut:

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `id` | INTEGER (PK) | auto | ID fasilitas |
| `nama_fasilitas` | VARCHAR(255) | ya | Nama tempat |
| `kategori_id` | INTEGER (FK) | ya | Relasi ke `kategori.id` |
| `alamat` | TEXT | ya | Alamat lengkap |
| `latitude` | DECIMAL(10,8) | ya | Koordinat Y |
| `longitude` | DECIMAL(11,8) | ya | Koordinat X |
| `no_telepon` | VARCHAR(20) | tidak | Kontak |
| `email` | VARCHAR(100) | tidak | Email fasilitas |
| `jam_operasional` | VARCHAR(100) | tidak | Contoh: 08:00–20:00 |
| `status_24_jam` | BOOLEAN | ya | `true` / `false` |
| `bpjs` | BOOLEAN | ya | Tersedia / tidak |
| `dokter_spesialis` | TEXT | tidak | Daftar spesialis (CSV atau teks) |
| `fasilitas` | TEXT | tidak | ICU, Ambulans, Farmasi, dll. |
| `deskripsi` | TEXT | tidak | Keterangan tambahan |
| `rating` | DECIMAL(2,1) | tidak | 0.0 – 5.0 |
| `foto` | VARCHAR(500) | tidak | Path/URL gambar |
| `created_by` | INTEGER (FK) | ya | `users.id` pembuat |
| `created_at` | TIMESTAMP | auto | Waktu input |

---

## 5. Tipe User dan Hak Akses

### 5.1 Public (tidak login)

| Aksi | Diizinkan |
|------|-----------|
| Melihat halaman Home, Explore Map, Data Fasilitas | ✅ |
| Melihat **semua** marker fasilitas di peta public | ✅ |
| Filter kategori, search, lihat detail | ✅ |
| Lokasi saya, rute ke fasilitas | ✅ |
| Tambah / edit / hapus marker | ❌ |

### 5.2 User Terdaftar (`role = user`)

| Aksi | Diizinkan |
|------|-----------|
| Semua fitur Public | ✅ |
| Login / register | ✅ |
| Tambah marker (Edit Mode) | ✅ |
| Edit marker **milik sendiri** | ✅ |
| Hapus marker **milik sendiri** | ✅ |
| Lihat marker di Explore Map | ✅ **semua** (sama public) |
| Lihat / kelola di Dashboard & Marker Saya | ✅ **milik sendiri saja** |
| Edit/hapus marker user lain | ❌ |
| Kelola user / kategori master | ❌ |

### 5.3 Admin (`role = admin`)

| Aksi | Diizinkan |
|------|-----------|
| Semua fitur Public + User | ✅ |
| Melihat **semua** marker | ✅ |
| Edit/hapus **semua** marker | ✅ |
| CRUD master kategori | ✅ |
| CRUD user | ✅ |
| Panel admin lengkap | ✅ |

### 5.2 Matriks Hak Akses Ringkas

| Fitur | Public | User | Admin |
|-------|--------|------|-------|
| Explore Map (lihat semua) | ✅ | ✅ | ✅ |
| Data Tabel (lihat semua) | ✅ | ✅ | ✅ |
| Tambah marker | ❌ | ✅ | ✅ |
| Edit marker sendiri | ❌ | ✅ | ✅ |
| Edit marker orang lain | ❌ | ❌ | ✅ |
| Hapus marker sendiri | ❌ | ✅ | ✅ |
| Hapus marker orang lain | ❌ | ❌ | ✅ |
| Dashboard / My Marker | ❌ | ✅ (own) | ✅ (all) |
| Master Kategori | ❌ | ❌ | ✅ |
| Kelola User | ❌ | ❌ | ✅ |

### 5.3 Aturan Visibilitas (KRITIS)

```
PUBLIC API  → GET /api/public/fasilitas     → SEMUA record
PRIVATE API → GET /api/private/my-fasilitas → WHERE created_by = userId
ADMIN API   → GET /api/admin/all-fasilitas  → SEMUA record
```

User login di **Explore Map** tetap melihat semua fasilitas (kebutuhan pencarian masyarakat).  
Aturan "hanya marker milik sendiri" berlaku di **Dashboard, Marker Saya, dan Edit Mode** (kelola data).

---

## 6. Fitur Utama

### 6.1 Fitur WAJIB (prioritas dosen)

| ID | Fitur | Teknologi / Catatan |
|----|-------|---------------------|
| F01 | Authentication (register, login, JWT) | jsonwebtoken |
| F02 | API Public & Private terpisah | Express routes |
| F03 | Peta Leaflet + marker | Leaflet.js (vanilla) |
| F04 | Marker Cluster | leaflet.markercluster |
| F05 | Filter kategori (realtime map + list) | Query / client filter |
| F06 | Search (nama, alamat, kategori) | Realtime |
| F07 | Navigasi 2 arah (list ↔ marker) | State `activeFacilityId` |
| F08 | Modal form tambah/edit | Bukan sidebar |
| F09 | Toggle View / Edit Mode | Hanya user login |
| F10 | Halaman data tabular | search, sort, pagination, filter |
| F11 | Multi user + ownership | `created_by` + middleware |
| F12 | Lokasi user | Browser Geolocation API |
| F13 | Route navigation | leaflet-routing-machine |
| F14 | Master kategori | Tabel `kategori`, CRUD admin |
| F15 | Card detail fasilitas | Bukan sidebar penuh |

### 6.2 Fitur Nilai Plus (sudah termasuk wajib di atas)

- Marker highlight + glow saat aktif
- Auto zoom ke marker terpilih
- Upload foto fasilitas
- Animasi card detail

---

## 7. Halaman Sistem

### 7.1 Public

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Home | Landing page HealthMap Bali |
| `/explore` | Explore Map | Peta + list + filter + routing |
| `/data-fasilitas` | Data Fasilitas | Tabel non-spasial |

### 7.2 User (perlu login)

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/dashboard` | Dashboard | Statistik marker user |
| `/my-marker` | Marker Saya | List marker milik user |
| `/login` | Login | Form login |
| `/register` | Register | Form daftar |

### 7.3 Admin (perlu login + role admin)

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/admin/users` | Kelola User | CRUD user |
| `/admin/markers` | Semua Marker | Semua fasilitas |
| `/admin/kategori` | Master Kategori | CRUD kategori |
| `/admin/spesialis` | Master Spesialis | CRUD jenis spesialis dokter |
| `/admin/jenis-fasilitas` | Master Jenis Fasilitas | CRUD jenis fasilitas (ICU, UGD, dll) |

---

## 8. Judul Proyek (pilih sesuai kebutuhan laporan)

| Gaya | Judul |
|------|-------|
| Formal | Sistem Informasi Geografis Fasilitas Kesehatan Berbasis Web di Bali |
| Modern | HealthMap Bali: WebGIS Fasilitas Kesehatan dengan Navigasi dan Multi User |
| Akademik | Implementasi WebGIS Fasilitas Kesehatan Menggunakan Marker Cluster dan Location Routing |

---

## 9. Aturan Dosen — Kesalahan yang Sering Dilakukan Agen

| No | Aturan | Salah ❌ | Benar ✅ |
|----|--------|---------|---------|
| 1 | Satu rumpun | Tambah POI wisata | Hanya fasilitas kesehatan |
| 2 | Kategori | `const KATEGORI = [...]` di React | Fetch dari API master |
| 3 | Form | Sidebar form CRUD | Modal popup |
| 4 | Cluster | Marker biasa saja | Leaflet MarkerCluster |
| 5 | Routing | Tidak ada rute | Leaflet Routing Machine |
| 6 | Data | Hanya peta | Ada halaman tabel terpisah |
| 7 | Ownership | User edit semua marker | Backend cek `created_by` |
| 8 | Public data | Public hanya lihat sendiri | Public lihat **semua** |
| 9 | Detail UI | Sidebar penuh detail | Card panel kanan / overlay |
| 10 | API | Satu endpoint tanpa auth split | `/public/*` vs `/private/*` |

---

## 10. Dokumen Terkait

| File | Isi |
|------|-----|
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | Arsitektur teknis |
| [03-SYSTEM-FLOW.md](./03-SYSTEM-FLOW.md) | Alur sistem per skenario |
| [04-API-SPECIFICATION.md](./04-API-SPECIFICATION.md) | Spesifikasi API |
| [05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md) | Skema PostgreSQL |
| [06-UI-UX-SPEC.md](./06-UI-UX-SPEC.md) | Spesifikasi UI/UX |
| [07-IMPLEMENTATION-GUIDE.md](./07-IMPLEMENTATION-GUIDE.md) | Urutan implementasi |

---

*Dokumen ini adalah sumber kebenaran (single source of truth) untuk scope proyek HealthMap Bali.*

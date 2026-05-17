# 07 — IMPLEMENTATION GUIDE

## HealthMap Bali — Panduan Eksekusi & Anti-Hallucination

**Versi:** 1.0  
**Untuk:** Developer / Agen AI yang mengimplementasikan proyek

---

## 1. Sebelum Mulai Coding

### 1.1 Wajib Dibaca (urutan)

1. [01-PROJECT-SPEC.md](./01-PROJECT-SPEC.md) — scope & aturan dosen
2. [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) — struktur teknis
3. [03-SYSTEM-FLOW.md](./03-SYSTEM-FLOW.md) — alur fitur
4. [04-API-SPECIFICATION.md](./04-API-SPECIFICATION.md) — kontrak API
5. [05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md) — skema DB
6. [06-UI-UX-SPEC.md](./06-UI-UX-SPEC.md) — desain UI
7. **Dokumen ini** — urutan implementasi

### 1.2 Keputusan Terkunci (JANGAN UBAH)

| ID | Keputusan |
|----|-----------|
| K01 | Public melihat **semua** marker |
| K02 | User login: kelola hanya marker **milik sendiri** |
| K03 | Stack: React Vite + Tailwind + Leaflet + Express + **PostgreSQL** + JWT |
| K04 | 1 rumpun: Fasilitas Kesehatan saja |
| K05 | Kategori = master data (tabel `kategori`) |
| K06 | Form = **Modal**, bukan sidebar |
| K07 | Wajib MarkerCluster + Routing Machine |

---

## 2. Fase Implementasi

### Fase 0 — Persiapan

- [ ] Clone / buka workspace `sig-peta`
- [ ] Install Node.js 18+, PostgreSQL 14+
- [ ] Baca semua dokumen 01–06
- [ ] Buat database `healthmap_bali`

**Deliverable:** Database kosong siap migrasi.

---

### Fase 1 — Backend Foundation

**Tujuan:** API dasar + auth + database.

#### Langkah

```bash
cd backend
npm init -y
npm install express pg bcryptjs jsonwebtoken cors dotenv multer express-validator
npm install -D nodemon
```

1. Setup `src/index.js`, `src/app.js`
2. Konfigurasi PostgreSQL pool (`src/config/db.js`)
3. Jalankan migration SQL dari [05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md)
4. Jalankan seed kategori (8 baris) + admin default
5. Implementasi:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/auth/me`
   - Middleware `authenticate`, `requireAdmin`
6. Test dengan Postman/Thunder Client

**Deliverable Fase 1:**
- [ ] Server jalan di port 5000
- [ ] Register & login return JWT
- [ ] Tabel users, kategori, fasilitas_kesehatan ada
- [ ] 8 kategori ter-seed

**Jangan lanjut ke Fase 2 jika auth belum berfungsi.**

---

### Fase 2 — Public API

**Tujuan:** Data untuk halaman public.

1. `GET /api/public/kategori`
2. `GET /api/public/fasilitas` — dengan query: `kategori_id`, `search`, `page`, `limit`, `sort`, `order`
3. `GET /api/public/fasilitas/:id`
4. JOIN `kategori` di setiap query fasilitas
5. Test: return **semua** fasilitas tanpa filter user

**Deliverable Fase 2:**
- [ ] Public endpoints return data benar
- [ ] Pagination meta `{ page, limit, total, totalPages }`
- [ ] Search ILIKE pada nama, alamat, nama_kategori

---

### Fase 3 — Frontend Public (Explore Map)

**Tujuan:** Halaman peta lengkap untuk public.

```bash
cd frontend
npm create vite@latest . -- --template react
npm install react-router-dom leaflet leaflet.markercluster leaflet-routing-machine axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Urutan komponen

1. `AuthContext` + `api.js` (axios + interceptor)
2. Layout: `Topbar`, routing (`App.jsx`)
3. Halaman `Home.jsx`
4. Halaman `ExploreMap.jsx`:
   - Fetch kategori + fasilitas
   - `MapContainer` + tile OSM
   - `MarkerClusterGroup` + custom icon per `warna_marker`
   - Sidebar kiri: SearchBar, CategoryFilter, FacilityList
   - Panel kanan: FacilityDetailCard
   - State `activeFacilityId` — navigasi 2 arah
5. Tombol Lokasi Saya + marker biru
6. Tombol Rute (Leaflet Routing Machine)
7. Halaman `DataFasilitas.jsx` — tabel + pagination

**Deliverable Fase 3:**
- [ ] `/explore` menampilkan peta Bali + cluster
- [ ] Filter kategori update map + list
- [ ] Search realtime
- [ ] Klik list ↔ marker sinkron
- [ ] Lokasi user + routing berfungsi
- [ ] `/data-fasilitas` tabel dengan pagination

**Jangan implementasi edit mode di fase ini.**

---

### Fase 4 — Private API + User Features

**Tujuan:** CRUD marker + ownership.

#### Backend

1. `POST /api/private/fasilitas` — set `created_by`
2. `PUT /api/private/fasilitas/:id` — ownership middleware
3. `DELETE /api/private/fasilitas/:id` — ownership middleware
4. `GET /api/private/my-fasilitas`
5. Upload foto dengan multer

#### Frontend

1. Halaman `Login.jsx`, `Register.jsx`
2. `ProtectedRoute` component
3. Toggle View / Edit Mode di topbar
4. `FacilityModal.jsx` — form tambah/edit
5. Klik peta saat Edit Mode → buka modal dengan lat/lng
6. Edit/hapus hanya marker milik user (tombol di detail card)
7. Halaman `Dashboard.jsx`, `MyMarker.jsx`

**Deliverable Fase 4:**
- [ ] User bisa register, login, logout
- [ ] Tambah marker via modal
- [ ] Edit/hapus marker sendiri berhasil
- [ ] Edit marker orang lain → 403
- [ ] My Marker hanya tampilkan milik sendiri

---

### Fase 5 — Halaman Tabular (Polish)

**Tujuan:** Memastikan halaman tabel lengkap.

- [ ] Sort semua kolom utama
- [ ] Filter kategori di halaman tabel
- [ ] Badge BPJS / 24 Jam
- [ ] Responsive mobile

---

### Fase 6 — Admin Panel

**Tujuan:** Fitur admin lengkap.

#### Backend

- `GET/POST/PUT/DELETE /api/admin/kategori`
- `GET/PUT/DELETE /api/admin/users`
- `GET /api/admin/all-fasilitas`
- `DELETE /api/admin/fasilitas/:id`

#### Frontend

- `/admin/kategori` — CRUD modal
- `/admin/users` — tabel + edit role
- `/admin/markers` — semua marker + hapus

**Deliverable Fase 6:**
- [ ] Admin bisa CRUD kategori
- [ ] Admin bisa kelola user
- [ ] Admin bisa hapus sembarang marker

---

### Fase 7 — Polish & Testing

- [ ] Animasi card detail (slide-in)
- [ ] Marker active glow CSS
- [ ] Toast notifications
- [ ] Error handling global (401 redirect)
- [ ] Loading skeleton
- [ ] Responsive semua halaman
- [ ] README.md root: cara install & run

---

## 3. Checklist Anti-Hallucination

Centang sebelum merge/setiap fase selesai:

### Scope

- [ ] Tidak ada POI selain fasilitas kesehatan
- [ ] Tidak ada fitur wisata/hotel/sekolah/kuliner

### Data & API

- [ ] `GET /public/fasilitas` return **semua** record
- [ ] `GET /private/my-fasilitas` filter `created_by = userId`
- [ ] Ownership dicek di **backend**, bukan hanya frontend
- [ ] Kategori dari API, tidak hardcode array di React

### Map

- [ ] Menggunakan `leaflet.markercluster`
- [ ] Cluster aktif saat zoom out
- [ ] Navigasi list ↔ marker dua arah (`activeFacilityId`)
- [ ] Lokasi user: marker biru + tombol
- [ ] Routing: `leaflet-routing-machine`

### UI

- [ ] Form tambah/edit = **Modal**
- [ ] Detail fasilitas = **Card** (bukan sidebar form penuh)
- [ ] Toggle View/Edit Mode ada
- [ ] Edit Mode OFF → klik peta tidak buka form

### Halaman

- [ ] Ada halaman tabular terpisah `/data-fasilitas`
- [ ] Ada halaman Home, Explore, Login, Register
- [ ] Ada Dashboard + My Marker (user)
- [ ] Ada 3 halaman admin

### Auth

- [ ] JWT di header `Authorization: Bearer`
- [ ] Public routes tidak butuh token
- [ ] Private routes return 401 tanpa token
- [ ] Admin routes return 403 untuk role user

---

## 4. Perintah Run Development

### Backend

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET
npm run dev
# Server: http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
# App: http://localhost:5173
```

### Database

```bash
psql -U postgres -c "CREATE DATABASE healthmap_bali;"
psql -U postgres -d healthmap_bali -f backend/migrations/001_create_users.sql
# ... jalankan semua migration dan seed
```

---

## 5. Testing Manual per Fitur Dosen

| No | Fitur Dosen | Cara Test |
|----|-------------|-----------|
| 1 | 1 rumpun kesehatan | Pastikan hanya kategori kesehatan |
| 2 | Banyak kategori | 8 kategori di master |
| 3 | Atribut lengkap | Cek form modal semua field |
| 4 | Multi user | Login 2 user, marker terpisah di my-marker |
| 5 | Public lihat semua | Buka /explore tanpa login, lihat semua marker |
| 6 | User lihat milik sendiri | /my-marker hanya marker user |
| 7 | API public/private | Postman: public tanpa token, private dengan token |
| 8 | JWT auth | Login → token → akses private |
| 9 | Master kategori | Admin CRUD kategori |
| 10 | Focus marker/list | Klik list → marker aktif; klik marker → list aktif |
| 11 | Modal form | Tambah/edit via popup modal |
| 12 | Data tabular | /data-fasilitas dengan search/sort/page |
| 13 | Marker cluster | Zoom out → cluster muncul |
| 14 | Lokasi user | Tombol Lokasi Saya → marker biru |
| 15 | Routing | Rute dari user ke fasilitas |
| 16 | Toggle edit mode | View mode tidak bisa tambah |

---

## 6. Troubleshooting Umum

| Masalah | Solusi |
|---------|--------|
| CORS error | Set `CORS_ORIGIN=http://localhost:5173` di backend |
| Marker tidak muncul | Cek import CSS leaflet di `main.jsx` |
| Cluster tidak jalan | Import `leaflet.markercluster/dist/MarkerCluster.css` |
| Routing gagal | Pastikan user location sudah didapat |
| 403 edit marker | Normal jika bukan pemilik — cek `created_by` |
| Token 401 | Cek expiry JWT, re-login |

---

## 7. Struktur README Root (buat di Fase 7)

```markdown
# HealthMap Bali

WebGIS Fasilitas Kesehatan di Bali.

## Tech Stack
React (Vite) + Tailwind + Leaflet | Express + PostgreSQL + JWT

## Setup
[instruksi backend]
[instruksi frontend]
[instruksi database]

## Dokumentasi
Lihat folder /docs
```

---

## 8. Definisi "Selesai" (Definition of Done)

Proyek dianggap selesai jika:

1. Semua item **Fase 1–7 Deliverable** tercentang
2. Semua item **Checklist Anti-Hallucination** tercentang
3. Semua baris **Testing Manual per Fitur Dosen** lulus
4. Aplikasi bisa di-demo: public explore → login → tambah marker → routing → tabel data → admin kelola kategori

---

## 9. Index Dokumentasi

| File | Fungsi |
|------|--------|
| [01-PROJECT-SPEC.md](./01-PROJECT-SPEC.md) | WHAT — apa yang dibangun |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | HOW (struktur) — arsitektur teknis |
| [03-SYSTEM-FLOW.md](./03-SYSTEM-FLOW.md) | HOW (alur) — skenario pengguna |
| [04-API-SPECIFICATION.md](./04-API-SPECIFICATION.md) | Kontrak API |
| [05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md) | Skema data |
| [06-UI-UX-SPEC.md](./06-UI-UX-SPEC.md) | Spesifikasi tampilan |
| [07-IMPLEMENTATION-GUIDE.md](./07-IMPLEMENTATION-GUIDE.md) | WHEN — urutan eksekusi (dokumen ini) |

---

*Ikuti fase secara berurutan. Jangan lompat fase. Jangan tambah fitur di luar dokumen 01.*

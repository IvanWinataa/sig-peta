# 09 — PENJELASAN STRUKTUR PROJECT DAN KEGUNAANNYA

Dokumen ini menjelaskan struktur project `sig-peta`, fungsi tiap folder, dan peran file-file penting agar mudah dipahami saat development, presentasi, maupun sidang.

---

## 1) Gambaran Umum Struktur

```text
sig-peta/
├── frontend/     # Aplikasi web (React + Leaflet.js)
├── backend/      # REST API server (Express + PostgreSQL + JWT)
├── docs/         # Dokumentasi teknis dan fungsional project
└── README.md     # Ringkasan project dan cara setup/run
```

### Kegunaan pembagian ini
- **frontend** fokus ke tampilan dan interaksi user.
- **backend** fokus ke data, autentikasi, aturan akses, dan query DB.
- **docs** jadi acuan agar implementasi konsisten dengan requirement dosen.

---

## 2) Struktur dan Kegunaan Folder `frontend/`

### 2.1 Entry Point dan konfigurasi aplikasi

| File | Kegunaan |
|---|---|
| `frontend/src/main.jsx` | Entry point React (mount aplikasi ke DOM). |
| `frontend/src/App.jsx` | Konfigurasi routing halaman public/user/admin. |
| `frontend/src/index.css` | Styling global, termasuk style Leaflet, marker, radar highlight, route. |

### 2.2 Folder halaman (`pages/`)

#### Public pages
| File | Kegunaan |
|---|---|
| `frontend/src/pages/public/Home.jsx` | Landing page aplikasi. |
| `frontend/src/pages/public/ExploreMap.jsx` | Halaman inti WebGIS: map, list, filter, search, marker interaction, route, modal CRUD. |
| `frontend/src/pages/public/DataFasilitas.jsx` | Halaman tabel fasilitas (search/sort/filter/pagination). |

#### Auth pages
| File | Kegunaan |
|---|---|
| `frontend/src/pages/auth/Login.jsx` | Form login user/admin. |
| `frontend/src/pages/auth/Register.jsx` | Form register user baru. |

#### User pages
| File | Kegunaan |
|---|---|
| `frontend/src/pages/user/Dashboard.jsx` | Ringkasan statistik marker milik user. |
| `frontend/src/pages/user/MyMarker.jsx` | Daftar marker milik user + edit/hapus. |

#### Admin pages
| File | Kegunaan |
|---|---|
| `frontend/src/pages/admin/AdminKategori.jsx` | CRUD master kategori fasilitas. |
| `frontend/src/pages/admin/AdminUsers.jsx` | Kelola user & role. |
| `frontend/src/pages/admin/AdminMarkers.jsx` | Lihat/hapus semua marker. |
| `frontend/src/pages/admin/AdminSpesialis.jsx` | CRUD master spesialis dokter. |
| `frontend/src/pages/admin/AdminJenisFasilitas.jsx` | CRUD master jenis fasilitas layanan. |

### 2.3 Folder komponen (`components/`)

#### Map components
| File | Kegunaan |
|---|---|
| `frontend/src/components/map/LeafletMap.jsx` | Integrasi Leaflet.js vanilla: tile layer, cluster, marker aktif, route, marker lokasi user. |

#### Facility components
| File | Kegunaan |
|---|---|
| `frontend/src/components/facility/CategoryFilter.jsx` | Filter fasilitas berdasarkan kategori. |
| `frontend/src/components/facility/FacilityList.jsx` | Panel list fasilitas (sinkron dengan marker map). |
| `frontend/src/components/facility/FacilityDetailCard.jsx` | Panel detail fasilitas aktif + tombol route/edit/delete. |
| `frontend/src/components/facility/FacilityModal.jsx` | Form tambah/edit fasilitas dalam modal popup. |
| `frontend/src/components/facility/MasterRowPicker.jsx` | Input baris dinamis dropdown + keterangan (spesialis/fasilitas). |

#### Layout/UI components
| File | Kegunaan |
|---|---|
| `frontend/src/components/layout/Topbar.jsx` | Navigasi utama + toggle mode + tombol lokasi saya. |
| `frontend/src/components/layout/ProtectedRoute.jsx` | Proteksi route berdasarkan login/role. |
| `frontend/src/components/ui/Modal.jsx` | Komponen modal reusable. |

### 2.4 State, service, util

| File | Kegunaan |
|---|---|
| `frontend/src/context/AuthContext.jsx` | Menyimpan state auth global (user, loading, logout, isAdmin). |
| `frontend/src/services/api.js` | Axios instance + inject Bearer token + handler error 401. |
| `frontend/src/services/publicService.js` | Semua endpoint public API. |
| `frontend/src/services/privateService.js` | Endpoint private user (my-fasilitas, create/update/delete). |
| `frontend/src/services/adminService.js` | Endpoint admin (users, kategori, all marker). |
| `frontend/src/services/authService.js` | Endpoint auth (login/register/me). |
| `frontend/src/services/masterService.js` | Endpoint master spesialis/jenis fasilitas (public + admin). |
| `frontend/src/utils/categoryIcons.jsx` | Mapping icon Lucide per kategori. |
| `frontend/src/utils/markerIcon.jsx` | Builder custom marker Leaflet (termasuk radar active highlight). |
| `frontend/src/utils/facilityJson.js` | Parse/format JSON field `dokter_spesialis` dan `fasilitas`. |

---

## 3) Struktur dan Kegunaan Folder `backend/`

### 3.1 Entry point dan konfigurasi

| File | Kegunaan |
|---|---|
| `backend/src/index.js` | Menjalankan server Express. |
| `backend/src/app.js` | Setup middleware global, route mounting, static uploads, error handler. |
| `backend/src/config/db.js` | Koneksi PostgreSQL (`pg Pool`). |
| `backend/src/config/jwt.js` | Konfigurasi secret dan expiry JWT. |

### 3.2 Routes API

| File | Kegunaan |
|---|---|
| `backend/src/routes/auth.routes.js` | Route autentikasi (`register`, `login`, `me`). |
| `backend/src/routes/public.routes.js` | Route data publik (kategori, fasilitas, master public). |
| `backend/src/routes/private.routes.js` | Route user login untuk CRUD marker sendiri. |
| `backend/src/routes/admin.routes.js` | Route khusus admin untuk data global dan master data. |

### 3.3 Controller layer

| File | Kegunaan |
|---|---|
| `backend/src/controllers/auth.controller.js` | Login/register, generate dan verifikasi identitas user. |
| `backend/src/controllers/public.controller.js` | Ambil data fasilitas/kategori untuk halaman public. |
| `backend/src/controllers/private.controller.js` | Logic create/update/delete marker user + my-fasilitas. |
| `backend/src/controllers/admin.controller.js` | Logic admin untuk user/kategori/all marker. |
| `backend/src/controllers/master.controller.js` | Logic CRUD master spesialis dan jenis fasilitas. |

### 3.4 Middleware

| File | Kegunaan |
|---|---|
| `backend/src/middleware/auth.middleware.js` | Validasi JWT (`authenticate`) dan role admin (`requireAdmin`). |
| `backend/src/middleware/ownership.middleware.js` | Memastikan user hanya mengubah marker miliknya. |

### 3.5 Utility backend

| File | Kegunaan |
|---|---|
| `backend/src/utils/fasilitasQuery.js` | SQL builder untuk filter/search/sort/pagination fasilitas. |
| `backend/src/utils/upload.js` | Konfigurasi upload foto dengan multer. |

### 3.6 Database migration dan script

| File/Folder | Kegunaan |
|---|---|
| `backend/migrations/*.sql` | Riwayat perubahan skema DB secara bertahap. |
| `backend/scripts/migrate.js` | Menjalankan seluruh migration SQL berurutan. |
| `backend/scripts/seed.js` | Mengisi data awal (kategori, admin default, master data). |

---

## 4) Struktur dan Kegunaan Folder `docs/`

| File | Kegunaan |
|---|---|
| `docs/01-PROJECT-SPEC.md` | Scope dan kebutuhan sistem. |
| `docs/02-ARCHITECTURE.md` | Arsitektur teknis aplikasi. |
| `docs/03-SYSTEM-FLOW.md` | Alur sistem per fitur/role. |
| `docs/04-API-SPECIFICATION.md` | Kontrak endpoint API. |
| `docs/05-DATABASE-SCHEMA.md` | Struktur tabel, relasi, dan seed DB. |
| `docs/06-UI-UX-SPEC.md` | Guideline desain UI/UX. |
| `docs/07-IMPLEMENTATION-GUIDE.md` | Tahapan implementasi dari awal hingga selesai. |
| `docs/08-CODE-FLOW-EXPLANATION.md` | Penjelasan alur berbasis kode aktual. |
| `docs/09-PROJECT-STRUCTURE-EXPLANATION.md` | Dokumen ini: peta struktur project dan fungsi file. |

---

## 5) Alur Ketergantungan Antar Bagian (Frontend ↔ Backend ↔ DB)

1. User berinteraksi di halaman frontend (`pages/*`, `components/*`).
2. Frontend memanggil service (`services/*`) yang menuju API backend.
3. Backend route meneruskan request ke controller.
4. Controller melakukan validasi + query DB (`utils/fasilitasQuery.js`, `pg`).
5. Response JSON dikirim balik ke frontend dan dirender ulang.

---

## 6) File Paling Krusial (untuk dipahami dulu)

Jika ingin cepat memahami project, baca urut ini:

1. `frontend/src/App.jsx`
2. `frontend/src/pages/public/ExploreMap.jsx`
3. `frontend/src/components/map/LeafletMap.jsx`
4. `frontend/src/components/facility/FacilityModal.jsx`
5. `backend/src/app.js`
6. `backend/src/routes/private.routes.js`
7. `backend/src/controllers/private.controller.js`
8. `backend/src/utils/fasilitasQuery.js`
9. `backend/src/middleware/auth.middleware.js`
10. `backend/src/middleware/ownership.middleware.js`

---

## 7) Kegunaan Dokumen Ini untuk Sidang/Review

Dokumen ini membantu Anda:
- menjelaskan arsitektur project dengan cepat,
- menunjukkan pemisahan tanggung jawab tiap folder,
- menjawab pertanyaan dosen: “fitur X ada di file mana?”,
- melakukan debugging lebih cepat karena tahu letak logic inti.


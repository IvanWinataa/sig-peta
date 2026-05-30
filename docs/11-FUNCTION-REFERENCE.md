# 11 — REFERENSI FUNGSI SELURUH PROJECT

Dokumen ini menjelaskan **setiap fungsi** di kode project `sig-peta` (HealthMap Bali): **untuk apa**, **kegunaan**, dan **dipakai di mana saja**.

> **Cakupan:** Hanya kode aplikasi (`frontend/src`, `backend/src`, `backend/scripts`). Folder `node_modules` tidak termasuk.  
> **Komponen React:** Selain fungsi biasa, komponen utama juga dicantumkan karena berperan sebagai "fungsi UI" yang dipanggil router.

**Dokumen terkait:** [10-FEATURE-CODE-MAP.md](./10-FEATURE-CODE-MAP.md) | [08-CODE-FLOW-EXPLANATION.md](./08-CODE-FLOW-EXPLANATION.md)

---

## Daftar Isi

- [Backend](#backend)
  - [Config](#backend--config)
  - [Middleware](#backend--middleware)
  - [Utils](#backend--utils)
  - [Controllers](#backend--controllers)
  - [Scripts](#backend--scripts)
  - [App & Entry](#backend--app--entry)
- [Frontend](#frontend)
  - [Utils](#frontend--utils)
  - [Services (API Client)](#frontend--services-api-client)
  - [Context](#frontend--context)
  - [Komponen](#frontend--komponen)
  - [Halaman (Pages)](#frontend--halaman-pages)
  - [Entry & Router](#frontend--entry--router)

---

# Backend

## Backend — Config

### `backend/src/config/db.js`

| Item | Tipe | Kegunaan | Dipakai di |
|---|---|---|---|
| `pool` | Konstanta (PostgreSQL Pool) | Koneksi ke database PostgreSQL | Semua controller & middleware yang query DB |

### `backend/src/config/jwt.js`

| Item | Tipe | Kegunaan | Dipakai di |
|---|---|---|---|
| `secret`, `expiresIn` | Konstanta | Konfigurasi signing/verifikasi JWT | `auth.controller.js`, `auth.middleware.js`, `public.controller.js` |

---

## Backend — Middleware

### `backend/src/middleware/auth.middleware.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `authenticate(req, res, next)` | 4–19 | Membaca header `Authorization: Bearer <token>`, memverifikasi JWT, menyimpan payload ke `req.user`. Jika gagal → `401`. | `auth.routes.js` (route `/me`), `private.routes.js` (semua route), `admin.routes.js` (semua route) |
| `requireAdmin(req, res, next)` | 21–26 | Memastikan `req.user.role === 'admin'`. Jika bukan admin → `403`. | `admin.routes.js` (setelah `authenticate`) |

### `backend/src/middleware/ownership.middleware.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `checkOwnership(req, res, next)` | 3–24 | Mengecek apakah user yang login adalah **pemilik** fasilitas (`created_by`) atau **admin**. Admin dilewati langsung. Jika bukan pemilik → `403`. | `private.routes.js` → `PUT /fasilitas/:id`, `DELETE /fasilitas/:id` |

---

## Backend — Utils

### `backend/src/utils/fasilitasQuery.js`

| Item / Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `FASILITAS_SELECT` | 1–14 | String SQL `SELECT` gabungan tabel `fasilitas_kesehatan` + `kategori` + `users` (nama pembuat). | `public.controller.js`, `private.controller.js`, `admin.controller.js` |
| `SORTABLE` | 16–21 | Mapping nama kolom sort dari query string ke kolom SQL aman. | Internal `buildListQuery` |
| `buildListQuery({...})` | 23–71 | Membangun query `COUNT` + `SELECT` dengan filter kategori, pencarian teks, pemilik (`created_by`), sort, paginasi (`LIMIT`/`OFFSET`). Mengembalikan `{ countQuery, dataQuery, params, countParams }`. | `getFasilitasList`, `getMyFasilitas`, `getAllFasilitas` |

### `backend/src/utils/upload.js`

| Item | Tipe | Untuk apa | Dipakai di |
|---|---|---|---|
| `upload` (multer instance) | Middleware | Menyimpan upload foto ke folder `uploads/`, batas 2MB, format JPG/PNG/WEBP. | `private.routes.js` → `POST` & `PUT` fasilitas (`upload.single('foto')`) |
| Callback `filename` | 12–15 | Generate nama file unik saat upload. | Internal multer |
| Callback `fileFilter` | 21–25 | Menolak file selain gambar yang diizinkan. | Internal multer; error ditangkap `app.js` middleware |

---

## Backend — Controllers

### `backend/src/controllers/auth.controller.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `signToken(user)` | 7–13 | Membuat JWT berisi `id`, `email`, `role`, `nama`. | Internal `login` |
| `userResponse(row)` | 15–17 | Memformat baris user DB → objek aman (tanpa password) untuk response API. | `register`, `login`, `me` |
| `register(req, res)` | 19–48 | Validasi input, cek email duplikat, hash password (`bcrypt`), insert user role `user`. | `POST /api/auth/register` |
| `login(req, res)` | 50–84 | Verifikasi email/password, kirim JWT + profil user. | `POST /api/auth/login` |
| `me(req, res)` | 86–100 | Ambil profil user dari DB berdasarkan `req.user.id` (dari JWT). | `GET /api/auth/me` |

### `backend/src/controllers/public.controller.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `getKategori(_req, res)` | 6–16 | Ambil semua kategori + `skema_atribut` untuk form dinamis. | `GET /api/public/kategori` → `ExploreMap`, `DataFasilitas`, `FacilityModal`, dll. |
| `getFasilitasList(req, res)` | 18–69 | List fasilitas dengan filter, search, sort, paginasi. Jika `filter_user=true` + token user biasa → hanya marker milik user tersebut; admin & tamu lihat semua. | `GET /api/public/fasilitas` → `ExploreMap`, `DataFasilitas`, `Dashboard` |
| `getFasilitasById(req, res)` | 71–105 | Detail satu fasilitas by ID; dukung filter pemilik sama seperti list. | `GET /api/public/fasilitas/:id` — **dieksport di frontend tapi belum dipakai halaman manapun** |

### `backend/src/controllers/private.controller.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `normalizeJsonField(val)` | 4–12 | Mengubah string/objek JSON (`dokter_spesialis`, `fasilitas`, `atribut_khusus`) menjadi string JSON valid untuk kolom jsonb. | Internal `parseBody` |
| `parseBody(body)` | 14–31 | Memetakan field `req.body` (FormData) ke objek terstruktur dengan tipe yang benar (angka, boolean, JSON). | `createFasilitas`, `updateFasilitas` |
| `createFasilitas(req, res)` | 33–64 | `INSERT` fasilitas baru; set `created_by` dari `req.user.id`; simpan path foto jika ada. | `POST /api/private/fasilitas` → `ExploreMap` (tambah marker) |
| `updateFasilitas(req, res)` | 66–106 | `UPDATE` data fasilitas; opsional ganti foto. | `PUT /api/private/fasilitas/:id` → `ExploreMap`, `MyMarker` |
| `deleteFasilitas(req, res)` | 108–116 | `DELETE` fasilitas by ID. | `DELETE /api/private/fasilitas/:id` → `ExploreMap`, `MyMarker` |
| `getMyFasilitas(req, res)` | 118–146 | List fasilitas **hanya milik user login** (`created_by = req.user.id`). | `GET /api/private/my-fasilitas` → `MyMarker`, `Dashboard` (user) |

### `backend/src/controllers/admin.controller.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `getAllFasilitas(req, res)` | 4–30 | List **semua** fasilitas (tanpa filter pemilik) untuk admin. | `GET /api/admin/all-fasilitas` → `AdminMarkers`, `Dashboard` (admin) |
| `deleteFasilitasAdmin(req, res)` | 32–46 | Hapus fasilitas apa pun (tanpa cek ownership). | `DELETE /api/admin/fasilitas/:id` → `AdminMarkers` |
| `getKategori(_req, res)` | 48–56 | List semua kategori (versi admin, kolom lengkap). | `GET /api/admin/kategori` → `AdminKategori` |
| `createKategori(req, res)` | 58–73 | Tambah kategori baru + skema atribut JSON. | `POST /api/admin/kategori` |
| `updateKategori(req, res)` | 75–90 | Ubah kategori & skema atribut. | `PUT /api/admin/kategori/:id` |
| `deleteKategori(req, res)` | 92–110 | Hapus kategori jika belum dipakai fasilitas. | `DELETE /api/admin/kategori/:id` |
| `getUsers(_req, res)` | 112–122 | List semua user (tanpa password). | `GET /api/admin/users` → `AdminUsers` |
| `updateUser(req, res)` | 124–139 | Ubah nama dan role user. | `PUT /api/admin/users/:id` → `AdminUsers` |
| `deleteUser(req, res)` | 141–152 | Hapus user; tidak boleh hapus diri sendiri. | `DELETE /api/admin/users/:id` → `AdminUsers` |

### `backend/src/controllers/master.controller.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `getSpesialisPublic(_req, res)` | 4–14 | Daftar spesialis untuk dropdown (publik). | `GET /api/public/spesialis` |
| `getJenisFasilitasPublic(_req, res)` | 16–26 | Daftar jenis fasilitas untuk dropdown (publik). | `GET /api/public/jenis-fasilitas` |
| `getSpesialisAdmin(_req, res)` | 29–37 | Daftar lengkap master spesialis. | `GET /api/admin/spesialis` → `AdminSpesialis` |
| `createSpesialis(req, res)` | 39–54 | Tambah nama spesialis baru. | `POST /api/admin/spesialis` |
| `updateSpesialis(req, res)` | 56–71 | Ubah nama spesialis. | `PUT /api/admin/spesialis/:id` |
| `deleteSpesialis(req, res)` | 73–81 | Hapus spesialis. | `DELETE /api/admin/spesialis/:id` |
| `getJenisFasilitasAdmin(_req, res)` | 84–92 | Daftar lengkap master jenis fasilitas. | `GET /api/admin/jenis-fasilitas` → `AdminJenisFasilitas` |
| `createJenisFasilitas(req, res)` | 94–109 | Tambah jenis fasilitas baru. | `POST /api/admin/jenis-fasilitas` |
| `updateJenisFasilitas(req, res)` | 111–126 | Ubah jenis fasilitas. | `PUT /api/admin/jenis-fasilitas/:id` |
| `deleteJenisFasilitas(req, res)` | 128–136 | Hapus jenis fasilitas. | `DELETE /api/admin/jenis-fasilitas/:id` |

---

## Backend — Scripts

### `backend/scripts/migrate.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `migrate()` | 5–17 | Menjalankan semua file `.sql` di folder `migrations/` secara berurutan untuk membuat/memperbarui skema DB. | Dijalankan manual: `node scripts/migrate.js` |

### `backend/scripts/seed.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `seed()` | 4+ | Mengisi data awal: kategori + skema atribut, user admin, master spesialis/jenis fasilitas, contoh fasilitas (jika DB kosong). | Dijalankan manual: `node scripts/seed.js` |

---

## Backend — App & Entry

### `backend/src/app.js`

| Item | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| Express `app` | 11–42 | Konfigurasi server: CORS, JSON parser, static `/uploads`, mount route `/api/auth`, `/api/public`, `/api/private`, `/api/admin`, error handler upload. | `index.js` |
| Handler `GET /api/health` | 25–27 | Cek API hidup. | Monitoring / testing manual |
| Error middleware | 34–40 | Menangkap error multer (format file salah) → `422`. | Otomatis Express |

### `backend/src/index.js`

| Item | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `app.listen(PORT)` | 5–7 | Menjalankan server HTTP di port 5000 (default). | Entry point backend (`npm start`) |

### File route (`*.routes.js`)

File route **tidak berisi fungsi bisnis** — hanya menghubungkan path HTTP → controller + middleware:

| File | Mount path | Fungsi |
|---|---|---|
| `auth.routes.js` | `/api/auth` | register, login, me |
| `public.routes.js` | `/api/public` | kategori, fasilitas, spesialis, jenis-fasilitas |
| `private.routes.js` | `/api/private` | CRUD fasilitas milik user |
| `admin.routes.js` | `/api/admin` | Kelola semua data (admin only) |

---

# Frontend

## Frontend — Utils

### `frontend/src/utils/categoryIcons.jsx`

| Fungsi / Item | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `CATEGORY_ICON_MAP` | 14–23 | Objek mapping key ikon DB → komponen Lucide React. | `getCategoryIcon`, `AdminKategori` (daftar pilihan ikon) |
| `getCategoryIcon(iconKey)` | 25–27 | Mengembalikan komponen ikon Lucide; fallback `Building2`. | `CategoryIcon`, `markerIcon.jsx` |
| `CategoryIcon({ iconKey, ... })` | 30–33 | Komponen JSX pembungkus ikon kategori. | `FacilityList`, `FacilityDetailCard`, `CategoryFilter`, `DataFasilitas`, `Dashboard`, `MyMarker`, `AdminMarkers`, `AdminKategori` |

### `frontend/src/utils/markerIcon.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `buildLeafletDivIcon(iconKey, color, isActive, L)` | 6–40 | Membuat `L.divIcon` custom: ikon kategori di pin, efek radar jika aktif. | `LeafletMap.jsx` (render marker fasilitas) |
| `buildUserLocationIcon(L)` | 42–49 | Membuat icon titik biru untuk lokasi user. | `LeafletMap.jsx` (marker geolocation) |

### `frontend/src/utils/facilityJson.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `parseSpesialisList(raw)` | 3–22 | Parse kolom `dokter_spesialis` (JSON atau teks lama) → array `{ spesialis_id, nama_dokter }`. | `FacilityModal` (isi form edit), internal `formatSpesialisDisplay` |
| `parseFasilitasList(raw)` | 24–42 | Parse kolom `fasilitas` → array `{ jenis_id, keterangan }`. | `FacilityModal` (isi form edit), internal `formatFasilitasDisplay` |
| `formatSpesialisDisplay(raw, masterList)` | 44–51 | Ubah data spesialis jadi array string tampilan (mis. "Bedah: dr. X"). | `FacilityDetailCard`, `DataFasilitas` |
| `formatFasilitasDisplay(raw, masterList)` | 53–60 | Ubah data fasilitas jadi array string tampilan. | `FacilityDetailCard`, `DataFasilitas` |

---

## Frontend — Services (API Client)

Lapisan tipis di atas `axios` — setiap fungsi = satu panggilan HTTP.

### `frontend/src/services/api.js`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `api` (instance axios) | 3–5 | Client HTTP dengan `baseURL` dari env. | Semua file `*Service.js` |
| Interceptor request | 7–13 | Otomatis sisipkan `Authorization: Bearer` dari `localStorage`. | Setiap request API terautentikasi |
| Interceptor response (error) | 15–26 | Jika `401` → hapus token & redirect ke `/login`. | Global — semua halaman |

### `frontend/src/services/authService.js`

| Fungsi | Endpoint | Dipakai di |
|---|---|---|
| `register(data)` | `POST /auth/register` | `Register.jsx` |
| `login(data)` | `POST /auth/login` | `AuthContext.login` ← `Login.jsx` |
| `getMe()` | `GET /auth/me` | `AuthContext` (validasi session saat app load) |

### `frontend/src/services/publicService.js`

| Fungsi | Endpoint | Dipakai di |
|---|---|---|
| `getKategori()` | `GET /public/kategori` | `ExploreMap`, `DataFasilitas`, `MyMarker`, `FacilityModal` |
| `getSpesialis()` | `GET /public/spesialis` | `ExploreMap`, `DataFasilitas`, `MyMarker` |
| `getJenisFasilitas()` | `GET /public/jenis-fasilitas` | `ExploreMap`, `DataFasilitas`, `MyMarker` |
| `getFasilitas(params)` | `GET /public/fasilitas` | `ExploreMap`, `DataFasilitas` |
| `getFasilitasById(id)` | `GET /public/fasilitas/:id` | **Belum dipakai** (tersedia untuk fitur detail by URL) |

### `frontend/src/services/privateService.js`

| Fungsi | Endpoint | Dipakai di |
|---|---|---|
| `getMyFasilitas(params)` | `GET /private/my-fasilitas` | `MyMarker`, `Dashboard` (user) |
| `createFasilitas(formData)` | `POST /private/fasilitas` | `ExploreMap` (tambah marker) |
| `updateFasilitas(id, formData)` | `PUT /private/fasilitas/:id` | `ExploreMap`, `MyMarker` |
| `deleteFasilitas(id)` | `DELETE /private/fasilitas/:id` | `ExploreMap`, `MyMarker` |

### `frontend/src/services/adminService.js`

| Fungsi | Endpoint | Dipakai di |
|---|---|---|
| `getAllFasilitas(params)` | `GET /admin/all-fasilitas` | `AdminMarkers`, `Dashboard` (admin) |
| `deleteFasilitasAdmin(id)` | `DELETE /admin/fasilitas/:id` | `AdminMarkers` |
| `getKategoriAdmin()` | `GET /admin/kategori` | `AdminKategori` |
| `createKategori(data)` | `POST /admin/kategori` | `AdminKategori` |
| `updateKategori(id, data)` | `PUT /admin/kategori/:id` | `AdminKategori` |
| `deleteKategori(id)` | `DELETE /admin/kategori/:id` | `AdminKategori` |
| `getUsers()` | `GET /admin/users` | `AdminUsers` |
| `updateUser(id, data)` | `PUT /admin/users/:id` | `AdminUsers` |
| `deleteUser(id)` | `DELETE /admin/users/:id` | `AdminUsers` |

### `frontend/src/services/masterService.js`

| Fungsi | Endpoint | Dipakai di |
|---|---|---|
| `getSpesialis()` | `GET /public/spesialis` | *(duplikat public — tidak di-import halaman)* |
| `getJenisFasilitas()` | `GET /public/jenis-fasilitas` | *(duplikat public)* |
| `getSpesialisAdmin()` | `GET /admin/spesialis` | `AdminSpesialis` |
| `createSpesialis(data)` | `POST /admin/spesialis` | `AdminSpesialis` |
| `updateSpesialis(id, data)` | `PUT /admin/spesialis/:id` | `AdminSpesialis` |
| `deleteSpesialis(id)` | `DELETE /admin/spesialis/:id` | `AdminSpesialis` |
| `getJenisFasilitasAdmin()` | `GET /admin/jenis-fasilitas` | `AdminJenisFasilitas` |
| `createJenisFasilitas(data)` | `POST /admin/jenis-fasilitas` | `AdminJenisFasilitas` |
| `updateJenisFasilitas(id, data)` | `PUT /admin/jenis-fasilitas/:id` | `AdminJenisFasilitas` |
| `deleteJenisFasilitas(id)` | `DELETE /admin/jenis-fasilitas/:id` | `AdminJenisFasilitas` |

---

## Frontend — Context

### `frontend/src/context/AuthContext.jsx`

| Fungsi / Komponen | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `AuthProvider({ children })` | 6–52 | Provider React: kelola state `user`, `loading`, fungsi login/logout, flag `isAdmin`. | `App.jsx` (membungkus seluruh app) |
| `login(email, password)` | 32–38 | Panggil API login, simpan token & user ke `localStorage`, update state. | `Login.jsx` |
| `logout()` | 41–45 | Hapus token & user dari storage, reset state. | `Topbar.jsx` |
| `useAuth()` | 54 | Hook untuk akses context auth dari komponen mana pun. | `ExploreMap`, `Login`, `Topbar`, `Dashboard`, `ProtectedRoute`, dll. |

---

## Frontend — Komponen

### `frontend/src/components/map/LeafletMap.jsx`

| Fungsi / Item | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `LeafletMap(props)` | 14–192 | Komponen peta Leaflet.js vanilla: tile OSM, cluster, marker, routing, lokasi user. | `ExploreMap.jsx` |
| `handleClick(e)` | 61–67 | Klik peta: jika edit mode → kirim koordinat; jika tidak → clear marker aktif. | Internal `useEffect` inisialisasi peta |
| `useEffect` inisialisasi | 39–81 | Buat map, cluster, event sekali saat mount. | Internal |
| `useEffect` cursor edit | 84–89 | Ubah kursor jadi crosshair saat edit mode. | Internal |
| `useEffect` marker | 92–115 | Render ulang semua marker saat `facilities` / `activeId` berubah. | Internal |
| `useEffect` flyTo | 118–125 | Animasi peta ke marker aktif. | Internal |
| `useEffect` user location | 128–142 | Tampilkan/hapus marker lokasi user. | Internal |
| `useEffect` routing | 145–183 | Gambar/hapus garis rute biru ke fasilitas aktif. | Internal |

### `frontend/src/components/facility/FacilityModal.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `FacilityModal(props)` | 20–325 | Modal form tambah/edit fasilitas lengkap dengan atribut dinamis. | `ExploreMap`, `MyMarker` |
| `set(key, val)` | 97 | Helper update satu field form utama. | Internal form |
| `setCustomValue(key, val)` | 99–113 | Update field `atribut_khusus`; sinkron `bpjs` / `status_24_jam` jika nama field cocok. | Input atribut dinamis |
| `handleKategoriChange(id)` | 115–120 | Ganti kategori → reset atribut khusus & checkbox terkait. | Select kategori |
| `buildSpesialisJson()` | 122–130 | Serialisasi baris spesialis ke JSON string untuk kolom DB. | `handleSubmit` |
| `buildFasilitasJson()` | 132–140 | Serialisasi baris fasilitas ke JSON string. | `handleSubmit` |
| `handleSubmit(e)` | 142–185 | Kumpulkan semua input ke `FormData`, panggil `onSubmit` dari parent. | Tombol Simpan form |

### `frontend/src/components/facility/FacilityDetailCard.jsx`

| Komponen | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `FacilityDetailCard(props)` | 18–261 | Panel detail fasilitas: foto, kontak, spesialis, atribut khusus, tombol rute/edit/hapus. | `ExploreMap.jsx` (panel kanan) |

*Tidak ada fungsi terpisah — logika parse `atribut_khusus` dan format tampilan ada inline di body komponen.*

### `frontend/src/components/facility/FacilityList.jsx`

| Komponen / Efek | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `FacilityList(props)` | 5–81 | Daftar fasilitas di sidebar kiri peta; klik & hover. | `ExploreMap.jsx` |
| `useEffect` scroll | 14–18 | Scroll otomatis ke item yang aktif. | Internal |

### `frontend/src/components/facility/CategoryFilter.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `CategoryFilter(props)` | 3–48 | Chip filter kategori di sidebar peta. | `ExploreMap.jsx` |
| `toggle(id)` | 4–10 | Tambah/hapus kategori dari filter aktif. | Tombol chip kategori |
| `selectAll()` | 12 | Reset filter → tampilkan semua kategori. | Tombol "Semua" |

### `frontend/src/components/facility/MasterRowPicker.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `MasterRowPicker(props)` | 10–93 | UI multi-baris: dropdown master + input teks tambahan. | `FacilityModal` (field `spesialis_list` / `fasilitas_list`) |
| `addRow()` | 23–25 | Tambah baris input baru. | Tombol "+ Tambah baris" |
| `updateRow(index, field, value)` | 27–30 | Update satu field di baris tertentu. | Input/select per baris |
| `removeRow(index)` | 32–34 | Hapus satu baris. | Tombol hapus baris |

### `frontend/src/components/layout/Topbar.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `Topbar(props)` | 5–117 | Navbar: menu, login/logout, mode edit, lokasi saya. | Hampir semua halaman |
| `linkClass({ isActive })` | 9–11 | Class CSS aktif/nonaktif untuk `NavLink`. | Menu navigasi |
| `dropdownLinkClass({ isActive })` | 13–15 | Class CSS untuk item dropdown "Kelola Data". | Submenu |

### `frontend/src/components/layout/ProtectedRoute.jsx`

| Komponen | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `ProtectedRoute({ children, adminOnly })` | 4–19 | Blokir halaman jika belum login; jika `adminOnly` → hanya role admin. Tampilkan spinner saat loading. | `Dashboard`, `MyMarker`, semua halaman `Admin*` |

### `frontend/src/components/ui/Modal.jsx`

| Komponen | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `Modal({ open, onClose, title, children, size })` | 3–26 | Dialog modal reusable (overlay + header + scroll body). | `FacilityModal`, `AdminSpesialis`, `AdminJenisFasilitas`, `AdminKategori` |

---

## Frontend — Halaman (Pages)

### `frontend/src/pages/public/ExploreMap.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `ExploreMap()` | 13–220 | **Halaman utama WebGIS** — peta, sidebar, detail, CRUD marker. | Route `/explore` |
| `loadData()` | 31–49 | Parallel fetch: kategori, master, fasilitas (limit 500). | `useEffect` mount, setelah simpan/hapus |
| `handleLocate()` | 72–81 | Ambil koordinat GPS user via browser. | Tombol "Lokasi Saya" (`Topbar`) |
| `handleMapClick(latlng)` | 83–93 | Buka modal tambah fasilitas di koordinat klik. | `LeafletMap` saat edit mode |
| `handleSave(formData)` | 95–111 | Create atau update fasilitas, tutup modal, refresh data. | `FacilityModal.onSubmit` |
| `handleDelete()` | 113–122 | Hapus fasilitas aktif setelah konfirmasi. | `FacilityDetailCard.onDelete` |

### `frontend/src/pages/public/DataFasilitas.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `DataFasilitas()` | 10–388 | Halaman tabel fasilitas dengan search, filter, sort, paginasi. | Route `/data-fasilitas` |
| `load()` | 31–46 | Fetch data tabel dari API (debounce 300ms). | `useEffect` saat filter berubah |
| `toggleSort(col)` | 52–57 | Ubah kolom sort / arah ascending-descending. | Header tabel |
| `SortTh` | 59–66 | Komponen header kolom yang bisa diklik sort. | JSX tabel |

### `frontend/src/pages/public/Home.jsx`

| Komponen | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `Home()` | 5–88 | Landing page: judul, CTA ke Explore Map & Data Tabel. | Route `/` |

### `frontend/src/pages/auth/Login.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `Login()` | 6–80 | Halaman form login. | Route `/login` |
| `handleSubmit(e)` | 14–26 | Submit login → redirect ke `/explore`. | Form login |

### `frontend/src/pages/auth/Register.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `Register()` | 6–72 | Halaman form registrasi akun baru. | Route `/register` |
| `handleSubmit(e)` | 12–28 | Validasi konfirmasi password, panggil API register. | Form register |
| `set(k, v)` | 30 | Helper update field form. | Input form |

### `frontend/src/pages/user/Dashboard.jsx`

| Fungsi / Komponen | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `DashboardContent()` | 11–74 | Statistik marker (total, BPJS, 24 jam) + daftar 5 marker terbaru. | Dibungkus `ProtectedRoute` |
| `Dashboard()` | 76–78 | Export halaman dengan proteksi login. | Route `/dashboard` |

### `frontend/src/pages/user/MyMarker.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `MyMarkerContent()` | 10–113 | Daftar & kelola marker milik user (edit/hapus). | Internal |
| `load()` | 19 | Refresh daftar marker user. | Mount & setelah simpan/hapus |
| `handleSave(fd)` | 30–42 | Update fasilitas via modal. | `FacilityModal` |
| `handleDelete(id)` | 44–52 | Hapus marker by ID. | Tombol hapus tabel |
| `MyMarker()` | 115–117 | Export dengan `ProtectedRoute`. | Route `/my-marker` |

### `frontend/src/pages/admin/AdminMarkers.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `AdminMarkersContent()` | 8–59 | Tabel semua marker + hapus (admin). | Internal |
| `load()` | 11 | Fetch semua fasilitas. | Mount & setelah hapus |
| `handleDelete(id)` | 14–22 | Hapus fasilitas via API admin. | Tombol hapus |
| `AdminMarkers()` | 61–63 | Export + `ProtectedRoute adminOnly`. | Route `/admin/markers` |

### `frontend/src/pages/admin/AdminUsers.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `AdminUsersContent()` | 7–72 | Kelola user: ubah role, hapus. | Internal |
| `load()` | 10 | Fetch daftar user. | Mount |
| `changeRole(id, role)` | 13–17 | Update role user ke `user` atau `admin`. | Select role |
| `handleDelete(id)` | 19–25 | Hapus akun user. | Tombol hapus |
| `AdminUsers()` | 74–76 | Export + proteksi admin. | Route `/admin/users` |

### `frontend/src/pages/admin/AdminKategori.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `AdminKategoriContent()` | 11–248 | CRUD kategori + editor skema atribut dinamis. | Internal |
| `load()` | 22 | Fetch kategori admin. | Mount |
| `openAdd()` | 25–34 | Buka modal form kategori kosong. | Tombol tambah |
| `openEdit(k)` | 36–46 | Buka modal dengan data kategori existing. | Tombol edit |
| `handleSave(e)` | 48–58 | Create/update kategori ke API. | Submit modal |
| `handleDelete(id)` | 60–68 | Hapus kategori. | Tombol hapus |
| `handleAddAtribut()` | 70–75 | Tambah satu field ke array skema atribut. | Editor skema |
| `handleRemoveAtribut(idx)` | 77–82 | Hapus field skema by index. | Tombol hapus field |
| `handleUpdateAtribut(idx, key, val)` | 84–89 | Update properti field skema (name, label, type). | Input skema |
| `AdminKategori()` | 250–252 | Export + proteksi admin. | Route `/admin/kategori` |

### `frontend/src/pages/admin/AdminSpesialis.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `Content()` | 13–86 | CRUD master spesialis. | Internal |
| `load()` | 19 | Fetch data spesialis. | Mount |
| `openAdd()` | 22 | Buka modal tambah. | Tombol tambah |
| `openEdit(row)` | 23 | Buka modal edit. | Tombol edit |
| `handleSave(e)` | 25–35 | Simpan spesialis baru/ubah. | Submit modal |
| `handleDelete(id)` | 37–43 | Hapus spesialis. | Tombol hapus |
| `AdminSpesialis()` | 88–90 | Export + proteksi admin. | Route `/admin/spesialis` |

### `frontend/src/pages/admin/AdminJenisFasilitas.jsx`

| Fungsi | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `Content()` | 13–86 | CRUD master jenis fasilitas (struktur sama dengan AdminSpesialis). | Internal |
| `load()`, `openAdd()`, `openEdit()`, `handleSave()`, `handleDelete()` | 19–43 | Sama seperti AdminSpesialis, untuk tabel `master_jenis_fasilitas`. | Internal |
| `AdminJenisFasilitas()` | 88–90 | Export + proteksi admin. | Route `/admin/jenis-fasilitas` |

---

## Frontend — Entry & Router

### `frontend/src/main.jsx`

| Item | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `createRoot(...).render()` | 6–9 | Mount aplikasi React ke elemen `#root` di HTML. | Entry point frontend (`index.html`) |

### `frontend/src/App.jsx`

| Komponen | Baris | Untuk apa | Dipakai di |
|---|---|---|---|
| `App()` | 16–38 | Mendefinisikan semua route React Router + membungkus `AuthProvider`. | `main.jsx` |

**Route yang didefinisikan:**

| Path | Komponen halaman |
|---|---|
| `/` | `Home` |
| `/explore` | `ExploreMap` |
| `/data-fasilitas` | `DataFasilitas` |
| `/login` | `Login` |
| `/register` | `Register` |
| `/dashboard` | `Dashboard` |
| `/my-marker` | `MyMarker` |
| `/admin/kategori` | `AdminKategori` |
| `/admin/spesialis` | `AdminSpesialis` |
| `/admin/jenis-fasilitas` | `AdminJenisFasilitas` |
| `/admin/users` | `AdminUsers` |
| `/admin/markers` | `AdminMarkers` |

---

## Ringkasan: Berapa Banyak Fungsi?

| Area | Perkiraan jumlah fungsi/named handler |
|---|---|
| Backend controllers + middleware + utils | ~45 fungsi |
| Backend scripts | 2 fungsi |
| Frontend services | ~35 fungsi export |
| Frontend utils | 8 fungsi |
| Frontend komponen & halaman | ~70+ fungsi/handler internal |
| **Total** | **~160+** (termasuk handler kecil & komponen React) |

---

## Fungsi yang Belum Dipakai di UI

| Fungsi | Lokasi | Catatan |
|---|---|---|
| `getFasilitasById(id)` | `publicService.js` | Siap dipakai jika nanti ada halaman detail `/fasilitas/:id` |
| `getSpesialis()`, `getJenisFasilitas()` di `masterService.js` | Duplikat dari `publicService` | Tidak di-import; halaman admin pakai versi `*Admin` |

---

*Dokumen ini dibuat untuk keperluan dokumentasi tugas, pembelajaran kode, dan persiapan sidang. Perbarui jika ada fungsi baru ditambahkan ke project.*

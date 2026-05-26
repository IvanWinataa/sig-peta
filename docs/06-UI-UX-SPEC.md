# 06 — UI/UX SPECIFICATION

## HealthMap Bali — Panduan Desain Antarmuka

**Versi:** 1.0  
**Konsep:** Modern Healthcare Dashboard — ramah pengguna, bukan programmer

---

## 1. Prinsip Desain

| Prinsip | Implementasi |
|---------|--------------|
| User-first | Label bahasa Indonesia, ikon jelas, minim jargon teknis |
| Fokus peta + list | Sidebar kiri = navigasi data; tengah = peta; kanan = detail |
| Estetika Modern | Penggunaan efek *Glassmorphism*, *floating panels*, dan *hover-lift* animasi mikro |
| Feedback visual | Highlight marker, animasi card, toast notifikasi, *gradient glow* pada UI |
| Aksesibilitas | Kontras teks cukup, tombol membulat (*rounded-full* / pill shape) min 40px tinggi |

---

## 2. Palet Warna

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `white` | `#FFFFFF` | Background utama, card, *glass panels* |
| `teal-600` | `#0D9488` | Primary button, active state, logo accent (utama) |
| `teal-700` | `#0F766E` | Hover button, heading accent |
| `sky-50` | `#F0F9FF` | Background sidebar ringan, badge |
| `sky-500` | `#0EA5E9` | Gradien sekunder, *glowing orbs* di latar belakang |
| `slate-50` | `#F8FAFC` | Background halaman, *base panel* |
| `slate-200` | `#E2E8F0` | Border, divider lembut |
| `slate-600` | `#475569` | Teks body / deskripsi |
| `slate-900` | `#0F172A` | Heading / judul utama |
| `danger` | `#EF4444` | Hapus, error |
| `warning` | `#F59E0B` | Peringatan |

**Kategori marker:** warna diambil dari `kategori.warna_marker` (API), bukan hardcode di CSS.

---

## 3. Tipografi

| Elemen | Font | Size | Weight |
|--------|------|------|--------|
| H1 (page title) | Plus Jakarta Sans | 28px - 72px | 700 / 800 |
| H2 (section) | Plus Jakarta Sans | 20px | 600 / 700 |
| Body | Plus Jakarta Sans | 14px | 400 |
| Caption / label | Plus Jakarta Sans | 12px | 500 / 600 |
| Button | Plus Jakarta Sans | 14px | 600 / 700 |

---

## 4. Layout Global

### 4.1 Topbar (semua halaman kecuali auth)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo] HealthMap Bali   Home  Explore  Data    [Lokasi Saya] [Login] │
└─────────────────────────────────────────────────────────────────────┘
```

**Isi topbar:**
- Logo + nama aplikasi (kiri)
- Navigasi: Home, Explore Map, Data Fasilitas
- Jika login: Dashboard, Marker Saya (user) / menu Admin (admin)
- Tombol **Lokasi Saya** (icon pin biru)
- Toggle **View / Edit Mode** (hanya jika login)
- Avatar / Login button (kanan) bergaya membulat penuh (*pill*)

**Visual:** 64px, *sticky top*, *glassmorphism* (background putih transparan + blur), *shadow* lembut, tanpa border bawah keras.

---

### 4.2 Layout Explore Map (3 kolom)

```
┌──────────────┬────────────────────────────────────┬──────────────┐
│   SIDEBAR    │           MAP AREA                 │ DETAIL CARD  │
│   KIRI       │           (flex grow)              │   KANAN      │
│  300px       │                                    │   320px      │
│              │                                    │  (opsional)  │
│ [Search]     │                                    │              │
│ [Filter chips│         LEAFLET MAP                │  [Foto]      │
│ [List scroll]│                                    │  Nama RS     │
│              │                                    │  Kategori    │
│              │                                    │  Alamat      │
│              │                                    │  [Rute]      │
└──────────────┴────────────────────────────────────┴──────────────┘
```

| Panel | Lebar | Konten |
|-------|-------|--------|
| Kiri | 320px, floating | Search, filter kategori (chip), list fasilitas scrollable. Menggunakan gaya *glass panel* mengambang (`margin: 1rem`, `shadow-2xl`, `rounded-3xl`). |
| Tengah | Penuh | Peta Leaflet berada di lapisan terbawah (z-index 0) sehingga panel-panel tampak mengambang di atas peta. |
| Kanan | 340px, floating | Card detail fasilitas aktif, bergaya sama seperti panel kiri (mengambang, sudut melengkung besar). |

**Mobile (< 768px):** Sidebar kiri jadi panel layar penuh; detail card jadi *bottom sheet*.

---

## 5. Komponen UI Detail

### 5.1 Search Bar

```
┌─────────────────────────────────────┐
│ 🔍  Cari nama, alamat, kategori...  │
└─────────────────────────────────────┘
```

- Debounce 300ms
- Placeholder bahasa Indonesia
- Icon search kiri
- Clear button (×) saat ada teks

---

### 5.2 Filter Kategori (Chip)

```
[ Semua ] [ Rumah Sakit ] [ Klinik ] [ Puskesmas ] [ Apotek ] ...
```

- Data dari `GET /api/public/kategori`
- Multi-select atau single-select (rekomendasi: multi-select)
- Chip aktif: background `medical-green`, teks putih
- Chip non-aktif: background `sky-light`, teks `gray-700`
- Scroll horizontal jika banyak kategori

---

### 5.3 Facility List Item

```
┌─────────────────────────────────────────┐
│ ● RSUD Bali Mandara          [RS]      │
│   Jl. Bypass Ngurah Rai...             │
│   ✓ BPJS  •  24 Jam                    │
└─────────────────────────────────────────┘
```

**State:**
- Default: border transparan, background putih, *hover-lift* animasi
- Hover: background `slate-50`, sedikit naik (`translate-y`), muncul bayangan
- Active: border kiri 4px `teal-500`, background `teal-50`, ada pendaran ring tipis `ring-teal-500/20`

---

### 5.4 Marker di Peta

| State | Visual |
|-------|--------|
| Default | Icon bulat warna kategori, diameter 28px |
| Active | Scale 1.3x, box-shadow glow warna kategori, animasi 3 gelombang radar pulse (radarPulse) |
| User location | Icon biru (`#38BDF8`), pulse animation |
| Cluster | Lingkaran hijau dengan angka count |

**CSS active marker (contoh):**

```css
.marker-active {
  transform: scale(1.3);
  filter: drop-shadow(0 0 8px var(--marker-color));
  z-index: 1000 !important;
}
```

---

### 5.5 Detail Card (Panel Kanan)

Muncul saat fasilitas dipilih. **Bukan sidebar form.**

```
┌──────────────────────────┐
│  (Gambar meluas ke atas batas dengan gradient transparan di bagian bawah)
│  RSUD Bali Mandara       │
│  🏥 Rumah Sakit          │
│  ─────────────────────   │
│  📍 Jl. Bypass...        │
│  📞 0361-123456          │
│  🕐 24 Jam               │
│  (Pill) BPJS Tersedia    │
│  ⭐ 4.5                  │
│  Spesialis: Dalam, Anak  │
│  Fasilitas: ICU, UGD     │
│  ─────────────────────   │
│  [ 🗺 Rute ke Lokasi ]   │ (Glow hover effect)
│  [ ✏️ Edit ] (jika owner) │
└──────────────────────────┘
```

**Animasi:** slide-in dari kanan, duration 350ms, gaya kubik bezier (halus). Kontainer memiliki padding internal `p-6` agar teks tidak terpotong saat gambar tidak ada.

---

### 5.6 Modal Form (Tambah / Edit)

**WAJIB modal centered overlay — BUKAN sidebar.**

```
        ┌─────────────────────────────────┐
        │  Tambah Fasilitas Kesehatan  ✕  │
        ├─────────────────────────────────┤
        │  Nama Fasilitas *               │
        │  [________________________]     │
        │  Kategori *        [dropdown ▼] │
        │  Alamat *                       │
        │  [________________________]     │
        │  Latitude *    Longitude *      │
        │  [________]    [________]       │
        │  No. Telepon   Email            │
        │  Jam Operasional                │
        │  [ ] BPJS   [ ] Buka 24 Jam     │
        │  Dokter Spesialis               │
        │  Fasilitas Tersedia             │
        │  Deskripsi                      │
        │  Rating (0-5)                   │
        │  Upload Foto  [ Pilih File ]    │
        ├─────────────────────────────────┤
        │        [Batal]  [Simpan]        │
        └─────────────────────────────────┘
```

| Field | Input type | Wajib |
|-------|------------|-------|
| nama_fasilitas | text | ✅ |
| kategori_id | select (dari API) | ✅ |
| alamat | textarea | ✅ |
| latitude | number (readonly jika dari klik peta) | ✅ |
| longitude | number | ✅ |
| no_telepon | tel | — |
| email | email | — |
| jam_operasional | text | — |
| status_24_jam | checkbox | — |
| bpjs | checkbox | — |
| dokter_spesialis | dynamic row (dalam atribut_khusus, tipe spesialis_list jika kategori mendukung) | — |
| fasilitas | dynamic row (dalam atribut_khusus, tipe fasilitas_list jika kategori mendukung) | — |
| deskripsi | textarea | — |
| rating | number step 0.1 | — |
| foto | file input | — |

**Backdrop:** `rgba(0,0,0,0.5)` — klik backdrop = tutup (dengan konfirmasi jika form berubah).

---

### 5.7 Toggle View / Edit Mode

```
[ 👁 View Mode ]  |  [ ✏️ Edit Mode ]
```

| Mode | Tampilan | Perilaku peta |
|------|----------|---------------|
| View | Toggle kiri aktif (abu) | Klik peta = tidak ada aksi |
| Edit | Toggle kanan aktif (hijau) | Klik peta = buka modal tambah |

Hanya visible jika user sudah login.

---

### 5.8 Tombol Lokasi Saya

- Posisi: topbar atau floating di pojok kanan atas peta
- Icon: crosshair biru
- Loading state: spinner saat `getCurrentPosition`
- Error: toast "Izinkan akses lokasi di browser"

---

### 5.9 Tombol Rute

- Di detail card: `[ Rute ke Lokasi ]`
- Warna tombol: `teal-600` solid dengan bayangan cahaya (*glow shadow*)
- Warna jalur di peta: Biru OSM (`#4285F4`), tebal 6px, ujung membulat (ala Google Maps)
- Disabled jika lokasi user belum didapat
- Saat aktif: tombol berubah jadi `[ Hapus Rute ]` merah outline

---

## 6. Halaman Data Tabular (`/data-fasilitas`)

```
┌─────────────────────────────────────────────────────────────┐
│  Data Fasilitas Kesehatan Bali                              │
│  [Search...]  [Filter Kategori ▼]                           │
├──────────┬──────────┬─────────────────┬──────┬───────┬───────┤
│ Nama ▲   │ Kategori │ Alamat          │ BPJS │ 24 Jam│ Telp  │
├──────────┼──────────┼─────────────────┼──────┼───────┼───────┤
│ RSUD ... │ RS       │ Jl. Bypass...   │  ✓   │  ✓    │ 0361..│
├──────────┴──────────┴─────────────────┴──────┴───────┴───────┤
│              < 1  2  3  4  5 >                               │
└─────────────────────────────────────────────────────────────┘
```

| Fitur | Implementasi |
|-------|--------------|
| Search | Query param `search`, debounce |
| Sort | Klik header kolom, toggle asc/desc |
| Pagination | 10 item per halaman |
| Filter kategori | Dropdown atau chip |
| BPJS / 24 Jam | Badge hijau (ya) / abu (tidak) |

---

## 7. Halaman Auth

### Login `/login`

- Card centered, max-width 400px
- Field: email, password
- Link ke register
- Tombol primary hijau "Masuk"

### Register `/register`

- Field: nama, email, password, konfirmasi password
- Tombol "Daftar"

---

## 8. Halaman User

### Dashboard `/dashboard`

- 3 stat card: Total Marker Saya, Dengan BPJS, Buka 24 Jam
- Mini list 5 marker terbaru
- Tombol CTA "Tambah Marker" → redirect ke Explore + Edit Mode

### Marker Saya `/my-marker`

- Tabel/list marker milik user
- Tombol edit (modal) dan hapus per baris

---

## 9. Halaman Admin

| Halaman | Komponen utama |
|---------|----------------|
| `/admin/kategori` | Tabel + modal CRUD kategori |
| `/admin/spesialis` | Tabel + modal CRUD jenis spesialis dokter |
| `/admin/jenis-fasilitas` | Tabel + modal CRUD jenis fasilitas (ICU, UGD, dll.) |
| `/admin/users` | Tabel user + edit role |
| `/admin/markers` | Tabel semua fasilitas + hapus |

Style konsisten dengan halaman user, badge role admin warna ungu.

---

## 10. Home Page `/`

**Hero section (Redesigned):**
- Judul: "Temukan Fasilitas Kesehatan di Bali" (teks 'Bali' menggunakan *gradient clip-text*)
- Subtitle: untuk masyarakat, mahasiswa rantau, wisatawan
- Latar Belakang (Background Decor): Bola cahaya *glowing* abstrak (*blur* 100px) menggunakan warna `teal` dan `sky`.
- Elemen *Badge*: Badge "Sistem Informasi Geografis Terpadu" berkedip di atas judul.
- CTA Utama: "Jelajahi Peta" dengan animasi panah bergeser saat di-hover.
- CTA Sekunder: "Lihat Data Tabel" bergaya tombol garis berbatas (*outlined*).

**Feature cards (3 kolom, floating glassmorphism):**
1. Peta Interaktif + Cluster
2. Navigasi Rute
3. Data Lengkap & Terfilter
- Kartu menggunakan gaya `.glass-panel` dan ikon warna-warni yang kontras.

---

## 11. Feedback & Notifikasi

| Event | UI |
|-------|-----|
| Simpan berhasil | Toast hijau kanan atas, 3 detik |
| Error validasi | Inline error di modal field |
| Hapus | Dialog konfirmasi |
| Loading data | Skeleton list / spinner peta |
| 401 session expired | Toast + redirect login |

---

## 12. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `< 768px` | Single column, drawer list, bottom sheet detail |
| `768–1024px` | Sidebar kiri + peta (tanpa panel kanan, detail jadi overlay) |
| `> 1024px` | Layout 3 kolom penuh |

---

## 13. Larangan UI (Agen Wajib Patuh)

| Larangan | Alternatif benar |
|----------|------------------|
| Form CRUD di sidebar kiri/kanan permanen | Modal popup |
| Sidebar penuh untuk detail | Card panel kanan / bottom sheet |
| Hardcode warna kategori di CSS | Ambil `warna_marker` dari API |
| Marker tanpa efek active | Scale + glow saat dipilih |
| Halaman tanpa nav ke Explore | Topbar selalu ada |

---

## 14. Dokumen Terkait

| File | Isi |
|------|-----|
| [03-SYSTEM-FLOW.md](./03-SYSTEM-FLOW.md) | Alur interaksi |
| [07-IMPLEMENTATION-GUIDE.md](./07-IMPLEMENTATION-GUIDE.md) | Urutan implementasi UI |

---

*Spesifikasi visual ini mengikat semua keputusan desain frontend.*

# HealthMap Bali

**WebGIS Fasilitas Kesehatan dengan Navigasi dan Multi User** — Sistem Informasi Geografis fasilitas kesehatan di Bali.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React (Vite), Tailwind CSS, **Leaflet.js** (vanilla), Lucide React |
| Map plugins | leaflet.markercluster, leaflet-routing-machine |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT |

> Peta menggunakan **Leaflet.js langsung** (bukan react-leaflet). Ikon kategori memakai **lucide-react** (Rumah Sakit, Klinik, Apotek, dll.).

## Fitur Utama

- Peta interaktif + marker cluster
- Filter kategori & pencarian (master kategori dari API)
- Navigasi 2 arah: list ↔ marker
- Lokasi user + routing ke fasilitas
- Toggle View / Edit Mode (user login)
- Form tambah/edit via **modal**
- Halaman data tabular
- Multi user (public lihat semua, user kelola marker sendiri)
- Panel admin: kategori, user, semua marker

## Setup

### 1. Database PostgreSQL

```sql
CREATE DATABASE healthmap_bali;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET

npm install
npm run migrate
npm run seed
npm run dev
```

API: `http://localhost:5000`

**Akun admin default:** `admin@healthmapbali.id` / `admin123`

### 3. Frontend

```bash
cd frontend
cp .env.example .env

npm install
npm run dev
```

App: `http://localhost:5173`

## Dokumentasi

Lihat folder [`docs/`](docs/) untuk spesifikasi lengkap:

- `01-PROJECT-SPEC.md` — Scope & aturan proyek
- `07-IMPLEMENTATION-GUIDE.md` — Urutan implementasi

## Struktur Proyek

```
sig-peta/
├── backend/          # Express API
├── frontend/         # React Vite
│   └── src/components/map/LeafletMap.jsx  # Peta Leaflet.js
└── docs/             # Dokumentasi acuan
```

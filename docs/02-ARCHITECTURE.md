# 02 — SYSTEM ARCHITECTURE

## HealthMap Bali — Arsitektur Teknis

**Versi:** 1.0  
**Stack:** React (Vite) + Tailwind + Leaflet | Express + PostgreSQL + JWT

---

## 1. Gambaran Umum

Sistem menggunakan arsitektur **3-tier**:

1. **Presentation Layer** — React SPA (Vite)
2. **Application Layer** — REST API Node.js Express
3. **Data Layer** — PostgreSQL

```mermaid
flowchart TB
  subgraph client [Frontend_React_Vite]
    PublicPages[Public_Pages]
    UserPages[User_Pages]
    AdminPages[Admin_Pages]
    MapLayer[Leaflet_Map_Layer]
  end

  subgraph api [Backend_Express]
    AuthMW[JWT_Middleware]
    PublicAPI["/api/public/*"]
    PrivateAPI["/api/private/*"]
    AdminAPI["/api/admin/*"]
    AuthAPI["/api/auth/*"]
  end

  subgraph data [PostgreSQL]
    Users[(users)]
    Kategori[(kategori)]
    Fasilitas[(fasilitas_kesehatan)]
  end

  PublicPages --> PublicAPI
  UserPages --> PrivateAPI
  AdminPages --> AdminAPI
  PublicPages --> AuthAPI
  UserPages --> AuthAPI
  MapLayer --> PublicAPI
  PublicAPI --> Fasilitas
  PrivateAPI --> AuthMW
  AdminAPI --> AuthMW
  AuthMW --> Fasilitas
  Fasilitas --> Kategori
  Fasilitas --> Users
```

---

## 2. Struktur Monorepo

```
sig-peta/
├── docs/                          # Dokumentasi (file ini)
├── frontend/                      # React Vite app
│   ├── public/
│   ├── src/
│   │   ├── assets/                # Logo, default images
│   │   ├── components/
│   │   │   ├── layout/            # Topbar, Sidebar, Footer
│   │   │   ├── map/               # MapContainer, MarkerCluster, Routing
│   │   │   ├── facility/          # FacilityList, FacilityCard, FacilityModal
│   │   │   ├── table/             # DataTable, Pagination, SortHeader
│   │   │   └── ui/                # Button, Modal, Input, Chip, Badge
│   │   ├── pages/
│   │   │   ├── public/            # Home, ExploreMap, DataFasilitas
│   │   │   ├── auth/              # Login, Register
│   │   │   ├── user/              # Dashboard, MyMarker
│   │   │   └── admin/             # Users, AllMarkers, Kategori
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFacilities.js
│   │   │   └── useGeolocation.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── publicService.js
│   │   │   ├── privateService.js
│   │   │   └── adminService.js
│   │   ├── utils/
│   │   │   ├── markerIcons.js     # Icon per kategori dari API
│   │   │   └── mapHelpers.js      # flyTo, bounds
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── index.js               # Entry point Express
│   │   ├── app.js                 # Express app setup
│   │   ├── config/
│   │   │   ├── db.js              # PostgreSQL pool
│   │   │   └── jwt.js             # JWT secret, expiry
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── public.routes.js
│   │   │   ├── private.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── public.controller.js
│   │   │   ├── private.controller.js
│   │   │   └── admin.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      # verify JWT
│   │   │   ├── role.middleware.js      # requireAdmin
│   │   │   └── ownership.middleware.js # cek created_by
│   │   ├── models/                     # Query layer (pg / Sequelize)
│   │   ├── validators/                 # express-validator schemas
│   │   └── utils/
│   │       └── upload.js               # multer config
│   ├── uploads/                   # File foto yang di-upload
│   ├── migrations/                # SQL migration files
│   ├── seeds/                     # seed kategori.sql
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 3. Komponen Frontend (Utama)

| Komponen | Tanggung jawab |
|----------|----------------|
| `MapContainer` | Inisialisasi Leaflet, tile layer OSM |
| `FacilityMarkers` | Render marker + MarkerClusterGroup |
| `FacilityList` | Sidebar kiri: list + highlight aktif |
| `CategoryFilter` | Chip filter dari data kategori API |
| `SearchBar` | Filter realtime nama/alamat |
| `FacilityDetailCard` | Panel kanan: detail fasilitas aktif |
| `FacilityModal` | Form tambah/edit (modal, bukan sidebar) |
| `EditModeToggle` | Switch View / Edit Mode |
| `UserLocationButton` | Geolocation + marker biru |
| `RouteControl` | Leaflet Routing Machine |
| `DataTablePage` | Halaman tabular terpisah |
| `ProtectedRoute` | Guard route berdasarkan auth + role |

---

## 4. Komponen Backend (Utama)

| Modul | Tanggung jawab |
|-------|----------------|
| `auth.routes` | POST register, login |
| `public.routes` | GET fasilitas, kategori — tanpa token |
| `private.routes` | CRUD fasilitas — butuh JWT |
| `admin.routes` | CRUD kategori, users, all fasilitas |
| `auth.middleware` | Validasi `Authorization: Bearer <token>` |
| `role.middleware` | Cek `req.user.role === 'admin'` |
| `ownership.middleware` | Cek `fasilitas.created_by === req.user.id` |

---

## 5. Pola Keamanan

### 5.1 Alur Autentikasi JWT

```mermaid
sequenceDiagram
  participant C as Client
  participant A as Auth_API
  participant D as Database

  C->>A: POST /api/auth/login
  A->>D: Cek email + bcrypt password
  D-->>A: User record
  A-->>C: JWT + user profile
  C->>C: Simpan token localStorage
  C->>A: Request dengan Header Authorization Bearer token
  A->>A: verify JWT
  A-->>C: Data protected
```

### 5.2 Penyimpanan Token (Frontend)

- Simpan di `localStorage` key: `healthmap_token`
- Axios interceptor: tambahkan header pada setiap request private/admin
- Logout: hapus token + redirect ke `/login`

### 5.3 Middleware Chain

```
Request
  → cors()
  → express.json()
  → [public routes] → controller → response
  → [private routes] → authenticate → controller → response
  → [admin routes]   → authenticate → requireAdmin → controller → response
  → [PUT/DELETE private] → authenticate → checkOwnership → controller
```

### 5.4 Aturan Ownership (Backend — WAJIB)

```javascript
// Pseudocode — wajib di backend, jangan hanya di frontend
if (req.user.role !== 'admin' && fasilitas.created_by !== req.user.id) {
  return res.status(403).json({ message: 'Tidak memiliki akses ke marker ini' });
}
```

---

## 6. Integrasi Peta (Leaflet)

| Plugin | Fungsi | Package |
|--------|--------|---------|
| Leaflet core | Peta dasar | `leaflet` (Leaflet.js vanilla via `LeafletMap.jsx`) |
| MarkerCluster | Pengelompokan marker zoom out | `leaflet.markercluster` |
| Routing Machine | Rute user → fasilitas | `leaflet-routing-machine` |
| Geolocation | Lokasi user (native browser) | `navigator.geolocation` |

**Tile layer default:** OpenStreetMap  
`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

**Center default peta Bali:** `[-8.4095, 115.1889]`, zoom `10`

---

## 7. Arsitektur Visibilitas Data

```mermaid
flowchart LR
  subgraph publicView [Public_Not_Logged_In]
    P1[Explore_Map]
    P2[Data_Tabel]
  end

  subgraph userView [User_Logged_In]
    U1[Explore_Map_see_all]
    U2[My_Marker_only_own]
    U3[Edit_Mode_own_only]
  end

  subgraph adminView [Admin]
    A1[See_All]
    A2[Edit_All]
    A3[Master_Kategori]
  end

  API_Public["GET /public/fasilitas\nALL records"]
  API_My["GET /private/my-fasilitas\nWHERE created_by = userId"]

  P1 --> API_Public
  P2 --> API_Public
  U1 --> API_Public
  U2 --> API_My
  U3 --> API_My
  A1 --> API_Public
```

---

## 8. Environment Variables

### Backend `.env`

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/healthmap_bali
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 9. Port dan URL Development

| Service | URL |
|---------|-----|
| Frontend (Vite) | `http://localhost:5173` |
| Backend (Express) | `http://localhost:5000` |
| PostgreSQL | `localhost:5432` |

---

## 10. Dependensi NPM

### Frontend

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "leaflet": "^1.9.x",
    "leaflet.markercluster": "^1.5.x",
    "leaflet-routing-machine": "^3.2.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

### Backend

```json
{
  "dependencies": {
    "express": "^4.x",
    "pg": "^8.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "multer": "^1.x",
    "express-validator": "^7.x"
  }
}
```

---

## 11. Dokumen Terkait

| File | Isi |
|------|-----|
| [01-PROJECT-SPEC.md](./01-PROJECT-SPEC.md) | Spesifikasi fungsional |
| [03-SYSTEM-FLOW.md](./03-SYSTEM-FLOW.md) | Alur per skenario |
| [04-API-SPECIFICATION.md](./04-API-SPECIFICATION.md) | Detail endpoint |
| [05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md) | Skema database |

---

*Arsitektur ini tidak boleh diubah tanpa revisi dokumen 01-PROJECT-SPEC.*

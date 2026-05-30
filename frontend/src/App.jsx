import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/public/Home';
import ExploreMap from './pages/public/ExploreMap';
import DataFasilitas from './pages/public/DataFasilitas';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import MyMarker from './pages/user/MyMarker';
import AdminKategori from './pages/admin/AdminKategori';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMarkers from './pages/admin/AdminMarkers';
import AdminSpesialis from './pages/admin/AdminSpesialis';
import AdminJenisFasilitas from './pages/admin/AdminJenisFasilitas';

// Komponen utama aplikasi React yang membungkus seluruh routing halaman serta AuthProvider context
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreMap />} />
          <Route path="/data-fasilitas" element={<DataFasilitas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-marker" element={<MyMarker />} />
          <Route path="/admin/kategori" element={<AdminKategori />} />
          <Route path="/admin/spesialis" element={<AdminSpesialis />} />
          <Route path="/admin/jenis-fasilitas" element={<AdminJenisFasilitas />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/markers" element={<AdminMarkers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

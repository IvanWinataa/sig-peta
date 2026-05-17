import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, LogIn, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ editMode, onToggleEditMode, onLocateMe }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0 z-20">
      <Link to="/" className="flex items-center gap-2 font-bold text-emerald-700 shrink-0">
        <MapPin className="w-6 h-6" />
        <span className="hidden sm:inline">HealthMap Bali</span>
      </Link>

      <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
        <NavLink to="/" className={linkClass} end>Home</NavLink>
        <NavLink to="/explore" className={linkClass}>Explore Map</NavLink>
        <NavLink to="/data-fasilitas" className={linkClass}>Data Fasilitas</NavLink>
        {user && (
          <>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/my-marker" className={linkClass}>Marker Saya</NavLink>
          </>
        )}
        {isAdmin && (
          <>
            <NavLink to="/admin/kategori" className={linkClass}>Kategori</NavLink>
            <NavLink to="/admin/spesialis" className={linkClass}>Spesialis</NavLink>
            <NavLink to="/admin/jenis-fasilitas" className={linkClass}>Jenis Fasilitas</NavLink>
            <NavLink to="/admin/markers" className={linkClass}>Semua Marker</NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> User</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="flex items-center gap-2 shrink-0">
        {onLocateMe && (
          <button
            type="button"
            onClick={onLocateMe}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden md:inline">Lokasi Saya</span>
          </button>
        )}

        {user && onToggleEditMode && (
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
            <button
              type="button"
              onClick={() => editMode && onToggleEditMode()}
              className={`px-3 py-2 ${!editMode ? 'bg-gray-100 text-gray-800' : 'text-gray-500'}`}
            >
              View
            </button>
            <button
              type="button"
              onClick={() => !editMode && onToggleEditMode()}
              className={`px-3 py-2 ${editMode ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}
            >
              Edit
            </button>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              {user.nama}
            </span>
            <button
              type="button"
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

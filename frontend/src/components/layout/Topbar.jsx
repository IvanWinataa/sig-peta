import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, LogIn, LogOut, User, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Komponen React untuk merender navigasi atas (topbar) yang berisi logo, menu navigasi utama, profil user, edit mode, dan tombol login/logout
export default function Topbar({ editMode, onToggleEditMode, onLocateMe }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Helper untuk menentukan class CSS dinamis menu navigasi berdasarkan status keaktifan link
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${isActive ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  // Helper untuk menentukan class CSS dinamis submenu dropdown navigasi berdasarkan status keaktifan link
  const dropdownLinkClass = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <header className="h-16 glass flex items-center px-4 gap-4 shrink-0 z-20 sticky top-0 shadow-sm border-b-0">
      <Link to="/" className="flex items-center gap-2 font-extrabold text-teal-700 shrink-0 text-lg tracking-tight">
        <MapPin className="w-6 h-6" />
        <span className="hidden sm:inline">BaliCare Map</span>
      </Link>

      <nav className="flex items-center gap-1 flex-1">
        <NavLink to="/" className={linkClass} end>Home</NavLink>
        <NavLink to="/explore" className={linkClass}>Explore Map</NavLink>

        <div className="relative group">
          <button className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-1 whitespace-nowrap">
            Kelola Data <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
            <NavLink to="/data-fasilitas" className={dropdownLinkClass}>Data Fasilitas</NavLink>
            {isAdmin && (
              <>
                <div className="h-px bg-slate-100 my-1 mx-3"></div>
                <NavLink to="/admin/kategori" className={dropdownLinkClass}>Kategori</NavLink>
                <NavLink to="/admin/spesialis" className={dropdownLinkClass}>Spesialis</NavLink>
                {/*<NavLink to="/admin/jenis-fasilitas" className={dropdownLinkClass}>Jenis Fasilitas</NavLink>*/}
                <NavLink to="/admin/markers" className={dropdownLinkClass}>Semua Marker</NavLink>
              </>
            )}
          </div>
        </div>

        {user && (
          <>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/my-marker" className={linkClass}>Marker Saya</NavLink>
          </>
        )}
        {isAdmin && (
          <NavLink to="/admin/users" className={linkClass}>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> User</span>
          </NavLink>
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
          <div className="flex rounded-full border border-slate-200 overflow-hidden text-xs font-semibold shadow-inner bg-slate-50">
            <button
              type="button"
              onClick={() => editMode && onToggleEditMode()}
              className={`px-4 py-2 transition-all ${!editMode ? 'bg-white text-slate-800 shadow shadow-slate-200/50 rounded-full' : 'text-slate-500 hover:text-slate-700'}`}
            >
              View
            </button>
            <button
              type="button"
              onClick={() => !editMode && onToggleEditMode()}
              className={`px-4 py-2 transition-all ${editMode ? 'bg-teal-600 text-white shadow rounded-full' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Edit
            </button>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <User className="w-4 h-4 text-teal-600" />
              {user.nama}
            </span>
            <button
              type="button"
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1 p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1 px-5 py-2 text-sm font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700 hover:shadow-md transition-all"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

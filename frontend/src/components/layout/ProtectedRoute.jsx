import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Komponen React untuk memproteksi halaman rute agar hanya dapat diakses oleh user yang telah login (dan secara opsional hanya untuk admin)
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}


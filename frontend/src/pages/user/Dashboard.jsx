import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Check, Clock } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { getMyFasilitas } from '../../services/privateService';
import { getAllFasilitas } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { CategoryIcon } from '../../utils/categoryIcons';

// Komponen internal untuk menampilkan ringkasan data statistik marker dan daftar marker terbaru
function DashboardContent() {
  const [data, setData] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchFn = isAdmin ? getAllFasilitas : getMyFasilitas;
    fetchFn({ limit: 100 }).then((r) => setData(r.data.data));
  }, [isAdmin]);

  const stats = {
    total: data.length,
    bpjs: data.filter((f) => f.bpjs).length,
    jam24: data.filter((f) => f.status_24_jam).length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Marker', value: stats.total, icon: MapPin, color: 'emerald' },
            { label: 'Dengan BPJS', value: stats.bpjs, icon: Check, color: 'blue' },
            { label: 'Buka 24 Jam', value: stats.jam24, icon: Clock, color: 'orange' },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white p-5 rounded-xl border shadow-sm">
              <Icon className="w-8 h-8 text-emerald-600 mb-2" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 mb-6"
        >
          <Plus className="w-4 h-4" /> Tambah Marker di Peta
        </Link>

        <h2 className="font-semibold text-gray-800 mb-3">Marker Terbaru</h2>
        <div className="bg-white rounded-xl border divide-y">
          {data.length === 0 ? (
            <p className="p-6 text-center text-gray-500 text-sm">Belum ada marker. Tambah di halaman Explore Map.</p>
          ) : (
            data.slice(0, 5).map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-4">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${f.warna_marker}22` }}>
                  <CategoryIcon iconKey={f.icon_marker} className="w-4 h-4" style={{ color: f.warna_marker }} />
                </span>
                <div>
                  <p className="font-medium text-sm">{f.nama_fasilitas}</p>
                  <p className="text-xs text-gray-500">{f.nama_kategori}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// Komponen Halaman Dashboard yang terproteksi oleh login dan menampilkan informasi statistik marker milik user/admin
export default function Dashboard() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}

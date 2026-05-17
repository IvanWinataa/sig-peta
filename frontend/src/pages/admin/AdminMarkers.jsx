import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { getAllFasilitas, deleteFasilitasAdmin } from '../../services/adminService';
import { CategoryIcon } from '../../utils/categoryIcons';

function AdminMarkersContent() {
  const [data, setData] = useState([]);

  const load = () => getAllFasilitas({ limit: 200 }).then((r) => setData(r.data.data));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus fasilitas ini?')) return;
    await deleteFasilitasAdmin(id);
    await load();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 max-w-5xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Semua Marker</h1>
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Pembuat</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{f.nama_fasilitas}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <CategoryIcon iconKey={f.icon_marker} className="w-4 h-4" style={{ color: f.warna_marker }} />
                      {f.nama_kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{f.nama_pembuat || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => handleDelete(f.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function AdminMarkers() {
  return <ProtectedRoute adminOnly><AdminMarkersContent /></ProtectedRoute>;
}

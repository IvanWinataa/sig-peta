import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import FacilityModal from '../../components/facility/FacilityModal';
import { getMyFasilitas, updateFasilitas, deleteFasilitas } from '../../services/privateService';
import { getKategori, getSpesialis, getJenisFasilitas } from '../../services/publicService';
import { CategoryIcon } from '../../utils/categoryIcons';

function MyMarkerContent() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [masterSpesialis, setMasterSpesialis] = useState([]);
  const [masterJenisFasilitas, setMasterJenisFasilitas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => getMyFasilitas({ limit: 200 }).then((r) => setData(r.data.data));

  useEffect(() => {
    load();
    Promise.all([getKategori(), getSpesialis(), getJenisFasilitas()]).then(([k, s, j]) => {
      setKategori(k.data.data);
      setMasterSpesialis(s.data.data);
      setMasterJenisFasilitas(j.data.data);
    });
  }, []);

  const handleSave = async (fd) => {
    setSaving(true);
    try {
      await updateFasilitas(editing.id, fd);
      setModalOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus marker ini?')) return;
    try {
      await deleteFasilitas(id);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marker Saya</h1>
        <p className="text-sm text-gray-500 mb-6">Hanya marker yang Anda buat ditampilkan di sini.</p>

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Alamat</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Belum ada marker</td></tr>
              ) : (
                data.map((f) => (
                  <tr key={f.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{f.nama_fasilitas}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <CategoryIcon iconKey={f.icon_marker} className="w-4 h-4" style={{ color: f.warna_marker }} />
                        {f.nama_kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]">{f.alamat}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => { setEditing(f); setModalOpen(true); }} className="p-1.5 text-gray-500 hover:text-emerald-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(f.id)} className="p-1.5 text-gray-500 hover:text-red-600 ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <FacilityModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSave}
        kategori={kategori}
        masterSpesialis={masterSpesialis}
        masterJenisFasilitas={masterJenisFasilitas}
        initial={editing}
        loading={saving}
      />
    </div>
  );
}

export default function MyMarker() {
  return <ProtectedRoute><MyMarkerContent /></ProtectedRoute>;
}

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import Modal from '../../components/ui/Modal';
import { getKategoriAdmin, createKategori, updateKategori, deleteKategori } from '../../services/adminService';
import { CategoryIcon, CATEGORY_ICON_MAP } from '../../utils/categoryIcons';

const ICON_OPTIONS = Object.keys(CATEGORY_ICON_MAP);

function AdminKategoriContent() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nama_kategori: '', icon_marker: 'hospital', warna_marker: '#10B981' });

  const load = () => getKategoriAdmin().then((r) => setData(r.data.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ nama_kategori: '', icon_marker: 'hospital', warna_marker: '#10B981' });
    setModalOpen(true);
  };

  const openEdit = (k) => {
    setEditing(k);
    setForm({ nama_kategori: k.nama_kategori, icon_marker: k.icon_marker, warna_marker: k.warna_marker });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateKategori(editing.id, form);
      else await createKategori(form);
      setModalOpen(false);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kategori?')) return;
    try {
      await deleteKategori(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Master Kategori</h1>
          <button type="button" onClick={openAdd} className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Icon</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Warna</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((k) => (
                <tr key={k.id} className="border-b">
                  <td className="px-4 py-3">
                    <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${k.warna_marker}22`, color: k.warna_marker }}>
                      <CategoryIcon iconKey={k.icon_marker} className="w-5 h-5" />
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{k.nama_kategori}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block w-6 h-6 rounded border" style={{ backgroundColor: k.warna_marker }} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => openEdit(k)} className="p-1.5 text-gray-500 hover:text-emerald-600"><Pencil className="w-4 h-4" /></button>
                    <button type="button" onClick={() => handleDelete(k.id)} className="p-1.5 text-gray-500 hover:text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kategori' : 'Tambah Kategori'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Nama Kategori</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm" value={form.nama_kategori} onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Icon (Lucide key)</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.icon_marker} onChange={(e) => setForm({ ...form, icon_marker: e.target.value })}>
              {ICON_OPTIONS.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              Preview: <CategoryIcon iconKey={form.icon_marker} style={{ color: form.warna_marker }} />
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Warna Marker</label>
            <input type="color" className="w-full h-10 rounded border" value={form.warna_marker} onChange={(e) => setForm({ ...form, warna_marker: e.target.value })} />
          </div>
          <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminKategori() {
  return <ProtectedRoute adminOnly><AdminKategoriContent /></ProtectedRoute>;
}

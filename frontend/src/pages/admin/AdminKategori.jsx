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
  const [form, setForm] = useState({
    nama_kategori: '',
    icon_marker: 'hospital',
    warna_marker: '#10B981',
    skema_atribut: [],
  });

  const load = () => getKategoriAdmin().then((r) => setData(r.data.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      nama_kategori: '',
      icon_marker: 'hospital',
      warna_marker: '#10B981',
      skema_atribut: [],
    });
    setModalOpen(true);
  };

  const openEdit = (k) => {
    setEditing(k);
    const skema = Array.isArray(k.skema_atribut) ? k.skema_atribut : [];
    setForm({
      nama_kategori: k.nama_kategori,
      icon_marker: k.icon_marker,
      warna_marker: k.warna_marker,
      skema_atribut: skema,
    });
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

  const handleAddAtribut = () => {
    setForm((f) => ({
      ...f,
      skema_atribut: [...(f.skema_atribut || []), { name: '', label: '', type: 'text', options: [] }],
    }));
  };

  const handleRemoveAtribut = (idx) => {
    setForm((f) => ({
      ...f,
      skema_atribut: (f.skema_atribut || []).filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateAtribut = (idx, key, val) => {
    setForm((f) => {
      const updated = [...(f.skema_atribut || [])];
      updated[idx] = { ...updated[idx], [key]: val };
      return { ...f, skema_atribut: updated };
    });
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kategori' : 'Tambah Kategori'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Nama Kategori</label>
              <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" value={form.nama_kategori} onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Icon (Lucide key)</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" value={form.icon_marker} onChange={(e) => setForm({ ...form, icon_marker: e.target.value })}>
                {ICON_OPTIONS.map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                Preview: <CategoryIcon iconKey={form.icon_marker} style={{ color: form.warna_marker }} />
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">Warna Marker</label>
              <input type="color" className="w-full h-10 rounded border cursor-pointer" value={form.warna_marker} onChange={(e) => setForm({ ...form, warna_marker: e.target.value })} />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-emerald-500 rounded-full"></span>
                Atribut Kustom
              </h4>
              <button
                type="button"
                onClick={handleAddAtribut}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                + Tambah Atribut
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {!form.skema_atribut || form.skema_atribut.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2 text-center">Belum ada atribut kustom. Kategori ini hanya memiliki atribut umum.</p>
              ) : (
                form.skema_atribut.map((attr, idx) => (
                  <div key={idx} className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveAtribut(idx)}
                      className="absolute top-2 right-3 text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      Hapus
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-2 sm:pt-0">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Nama Atribut (ID/Key)*</label>
                        <input
                          required
                          placeholder="contoh: jenis_pijat"
                          className="w-full border rounded px-2.5 py-1.5 text-xs outline-none bg-white focus:border-emerald-500"
                          value={attr.name}
                          onChange={(e) => handleUpdateAtribut(idx, 'name', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Label Tampilan*</label>
                        <input
                          required
                          placeholder="contoh: Jenis Pijat"
                          className="w-full border rounded px-2.5 py-1.5 text-xs outline-none bg-white focus:border-emerald-500"
                          value={attr.label}
                          onChange={(e) => handleUpdateAtribut(idx, 'label', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Tipe Input*</label>
                        <select
                          className="w-full border rounded px-2 py-1.5 text-xs outline-none bg-white focus:border-emerald-500"
                          value={attr.type}
                          onChange={(e) => handleUpdateAtribut(idx, 'type', e.target.value)}
                        >
                          <option value="text">Teks (text)</option>
                          <option value="number">Angka (number)</option>
                          <option value="spesialis_list">Dokter Spesialis (List)</option>
                          <option value="fasilitas_list">Fasilitas Tersedia (List)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminKategori() {
  return <ProtectedRoute adminOnly><AdminKategoriContent /></ProtectedRoute>;
}

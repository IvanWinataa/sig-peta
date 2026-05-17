import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import Modal from '../../components/ui/Modal';
import {
  getSpesialisAdmin,
  createSpesialis,
  updateSpesialis,
  deleteSpesialis,
} from '../../services/masterService';

function Content() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nama, setNama] = useState('');

  const load = () => getSpesialisAdmin().then((r) => setData(r.data.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setNama(''); setModalOpen(true); };
  const openEdit = (row) => { setEditing(row); setNama(row.nama_spesialis); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateSpesialis(editing.id, { nama_spesialis: nama });
      else await createSpesialis({ nama_spesialis: nama });
      setModalOpen(false);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus jenis spesialis ini?')) return;
    try {
      await deleteSpesialis(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 max-w-3xl w-full mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-bold">Master Spesialis Dokter</h1>
          </div>
          <button type="button" onClick={openAdd} className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">
            <Plus className="w-4 h-4" /> Tambah Spesialis
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Kelola daftar spesialis yang bisa dipilih user saat menambah fasilitas.</p>

        <ul className="bg-white rounded-xl border divide-y">
          {data.map((row) => (
            <li key={row.id} className="flex items-center justify-between px-4 py-3">
              <span className="font-medium">{row.nama_spesialis}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => openEdit(row)} className="p-2 text-gray-500 hover:text-emerald-600"><Pencil className="w-4 h-4" /></button>
                <button type="button" onClick={() => handleDelete(row.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Spesialis' : 'Tambah Spesialis'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Spesialis</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Penyakit Dalam" />
          </div>
          <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminSpesialis() {
  return <ProtectedRoute adminOnly><Content /></ProtectedRoute>;
}

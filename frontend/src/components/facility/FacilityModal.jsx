import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import MasterRowPicker from './MasterRowPicker';
import { parseSpesialisList, parseFasilitasList } from '../../utils/facilityJson';

const emptyForm = {
  nama_fasilitas: '',
  kategori_id: '',
  alamat: '',
  latitude: '',
  longitude: '',
  no_telepon: '',
  email: '',
  jam_operasional: '',
  status_24_jam: false,
  bpjs: false,
  deskripsi: '',
  rating: '',
};

export default function FacilityModal({
  open,
  onClose,
  onSubmit,
  kategori = [],
  masterSpesialis = [],
  masterJenisFasilitas = [],
  initial,
  loading,
}) {
  const [form, setForm] = useState(emptyForm);
  const [spesialisRows, setSpesialisRows] = useState([]);
  const [fasilitasRows, setFasilitasRows] = useState([]);
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          nama_fasilitas: initial.nama_fasilitas || '',
          kategori_id: String(initial.kategori_id || ''),
          alamat: initial.alamat || '',
          latitude: String(initial.latitude ?? ''),
          longitude: String(initial.longitude ?? ''),
          no_telepon: initial.no_telepon || '',
          email: initial.email || '',
          jam_operasional: initial.jam_operasional || '',
          status_24_jam: !!initial.status_24_jam,
          bpjs: !!initial.bpjs,
          deskripsi: initial.deskripsi || '',
          rating: initial.rating != null ? String(initial.rating) : '',
        });
        const sp = parseSpesialisList(initial.dokter_spesialis);
        const fa = parseFasilitasList(initial.fasilitas);
        setSpesialisRows(sp.length ? sp : []);
        setFasilitasRows(fa.length ? fa : []);
      } else {
        setForm(emptyForm);
        setSpesialisRows([]);
        setFasilitasRows([]);
      }
      setFoto(null);
    }
  }, [open, initial]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const buildSpesialisJson = () =>
    JSON.stringify(
      spesialisRows
        .filter((r) => r.spesialis_id)
        .map((r) => ({
          spesialis_id: Number(r.spesialis_id),
          nama_dokter: r.nama_dokter?.trim() || '',
        }))
    );

  const buildFasilitasJson = () =>
    JSON.stringify(
      fasilitasRows
        .filter((r) => r.jenis_id)
        .map((r) => ({
          jenis_id: Number(r.jenis_id),
          keterangan: r.keterangan?.trim() || '',
        }))
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'status_24_jam' || k === 'bpjs') fd.append(k, v ? 'true' : 'false');
      else if (v !== '' && v != null) fd.append(k, v);
    });
    fd.append('dokter_spesialis', buildSpesialisJson());
    fd.append('fasilitas', buildFasilitasJson());
    if (foto) fd.append('foto', foto);
    onSubmit(fd);
  };

  const inputCls =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none';

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Fasilitas' : 'Tambah Fasilitas Kesehatan'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Fasilitas *</label>
            <input required className={inputCls} value={form.nama_fasilitas} onChange={(e) => set('nama_fasilitas', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Kategori *</label>
            <select required className={inputCls} value={form.kategori_id} onChange={(e) => set('kategori_id', e.target.value)}>
              <option value="">Pilih kategori</option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>{k.nama_kategori}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Alamat *</label>
            <textarea required rows={2} className={inputCls} value={form.alamat} onChange={(e) => set('alamat', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Latitude *</label>
            <input required type="number" step="any" className={inputCls} value={form.latitude} onChange={(e) => set('latitude', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Longitude *</label>
            <input required type="number" step="any" className={inputCls} value={form.longitude} onChange={(e) => set('longitude', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">No. Telepon</label>
            <input className={inputCls} value={form.no_telepon} onChange={(e) => set('no_telepon', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Jam Operasional</label>
            <input className={inputCls} placeholder="08:00 - 20:00" value={form.jam_operasional} onChange={(e) => set('jam_operasional', e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.bpjs} onChange={(e) => set('bpjs', e.target.checked)} className="rounded text-emerald-600" />
            Tersedia BPJS
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.status_24_jam} onChange={(e) => set('status_24_jam', e.target.checked)} className="rounded text-emerald-600" />
            Buka 24 Jam
          </label>

          <div className="sm:col-span-2 border-t border-gray-100 pt-4">
            <MasterRowPicker
              mode="spesialis"
              masterOptions={masterSpesialis}
              rows={spesialisRows}
              onChange={setSpesialisRows}
              masterLabel="Pilih spesialis"
            />
          </div>

          <div className="sm:col-span-2 border-t border-gray-100 pt-4">
            <MasterRowPicker
              mode="fasilitas"
              masterOptions={masterJenisFasilitas}
              rows={fasilitasRows}
              onChange={setFasilitasRows}
              masterLabel="Pilih jenis fasilitas"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
            <textarea rows={2} className={inputCls} value={form.deskripsi} onChange={(e) => set('deskripsi', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rating (0-5)</label>
            <input type="number" min="0" max="5" step="0.1" className={inputCls} value={form.rating} onChange={(e) => set('rating', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Upload Foto</label>
            <input type="file" accept="image/*" className={inputCls} onChange={(e) => setFoto(e.target.files?.[0] || null)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
            Batal
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

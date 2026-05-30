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
};

// Komponen React untuk merender form modal tambah/edit fasilitas kesehatan lengkap dengan atribut dinamis per kategori
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
  const [atributKhusus, setAtributKhusus] = useState({});

  const selectedCategory = kategori.find((k) => String(k.id) === String(form.kategori_id));
  const categoryName = selectedCategory ? selectedCategory.nama_kategori : '';

  // Load custom fields dynamic schema from category object loaded from DB
  let customFields = [];
  if (selectedCategory && selectedCategory.skema_atribut) {
    try {
      customFields = typeof selectedCategory.skema_atribut === 'string'
        ? JSON.parse(selectedCategory.skema_atribut)
        : selectedCategory.skema_atribut;
      if (!Array.isArray(customFields)) customFields = [];
    } catch (e) {
      console.error('Failed to parse skema_atribut', e);
    }
  }

  const hasBpjsField = customFields.some((f) => f.name === 'bpjs');
  const has24HoursField = customFields.some((f) => f.name === 'obat_24_jam');

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
        });
        const sp = parseSpesialisList(initial.dokter_spesialis);
        const fa = parseFasilitasList(initial.fasilitas);
        setSpesialisRows(sp.length ? sp : []);
        setFasilitasRows(fa.length ? fa : []);

        let initialAtribut = {};
        if (initial.atribut_khusus) {
          try {
            initialAtribut = typeof initial.atribut_khusus === 'string'
              ? JSON.parse(initial.atribut_khusus)
              : initial.atribut_khusus;
          } catch (e) {
            console.error('Failed to parse atribut_khusus', e);
          }
        }
        setAtributKhusus(initialAtribut);
      } else {
        setForm(emptyForm);
        setSpesialisRows([]);
        setFasilitasRows([]);
        setAtributKhusus({});
      }
      setFoto(null);
    }
  }, [open, initial]);

  // Helper untuk memperbarui nilai satu field pada form utama
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Helper untuk memperbarui nilai atribut khusus dinamis dan otomatis menyinkronkan dengan kolom bawaan (BPJS/Operasional 24 Jam)
  const setCustomValue = (key, val) => {
    setAtributKhusus((prev) => {
      const next = { ...prev, [key]: val };

      // Sync BPJS field with DB column
      if (key === 'bpjs') {
        set('bpjs', val === 'Ya');
      }
      // Sync 24 Hours field with DB column
      if (key === 'obat_24_jam') {
        set('status_24_jam', val === 'Ya');
      }
      return next;
    });
  };

  // Menangani perubahan kategori terpilih pada form untuk mereset atribut khusus bawaan kategori lama
  const handleKategoriChange = (newKategoriId) => {
    set('kategori_id', newKategoriId);
    setAtributKhusus({});
    set('bpjs', false);
    set('status_24_jam', false);
  };

  // Mengubah data list dokter spesialis berelasi menjadi format string JSON yang valid sebelum dikirim ke database
  const buildSpesialisJson = () =>
    JSON.stringify(
      spesialisRows
        .filter((r) => r.spesialis_id)
        .map((r) => ({
          spesialis_id: Number(r.spesialis_id),
          nama_dokter: r.nama_dokter?.trim() || '',
        }))
    );

  // Mengubah data list fasilitas berelasi menjadi format string JSON yang valid sebelum dikirim ke database
  const buildFasilitasJson = () =>
    JSON.stringify(
      fasilitasRows
        .filter((r) => r.jenis_id)
        .map((r) => ({
          jenis_id: Number(r.jenis_id),
          keterangan: r.keterangan?.trim() || '',
        }))
    );

  // Menangani pengiriman form (submit): membuat objek FormData dan memanggil fungsi onSubmit yang dikirim oleh parent
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'status_24_jam' || k === 'bpjs') fd.append(k, v ? 'true' : 'false');
      else if (v !== '' && v != null) fd.append(k, v);
    });
    fd.append('dokter_spesialis', buildSpesialisJson());
    fd.append('fasilitas', buildFasilitasJson());

    // Clean up spesialis_list and fasilitas_list in atribut_khusus
    const cleanedAtributKhusus = { ...atributKhusus };
    customFields.forEach((field) => {
      if (field.type === 'spesialis_list') {
        const rows = cleanedAtributKhusus[field.name];
        if (Array.isArray(rows)) {
          cleanedAtributKhusus[field.name] = rows
            .filter((r) => r.spesialis_id)
            .map((r) => ({
              spesialis_id: Number(r.spesialis_id),
              nama_dokter: r.nama_dokter?.trim() || '',
            }));
        } else {
          cleanedAtributKhusus[field.name] = [];
        }
      } else if (field.type === 'fasilitas_list') {
        const rows = cleanedAtributKhusus[field.name];
        if (Array.isArray(rows)) {
          cleanedAtributKhusus[field.name] = rows
            .filter((r) => r.jenis_id)
            .map((r) => ({
              jenis_id: Number(r.jenis_id),
              keterangan: r.keterangan?.trim() || '',
            }));
        } else {
          cleanedAtributKhusus[field.name] = [];
        }
      }
    });

    fd.append('atribut_khusus', JSON.stringify(cleanedAtributKhusus));
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
            <select required className={inputCls} value={form.kategori_id} onChange={(e) => handleKategoriChange(e.target.value)}>
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

          <div className="flex gap-4 sm:col-span-2 py-1">
            {!hasBpjsField && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.bpjs} onChange={(e) => set('bpjs', e.target.checked)} className="rounded text-emerald-600" />
                Tersedia BPJS
              </label>
            )}
            {!has24HoursField && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.status_24_jam} onChange={(e) => set('status_24_jam', e.target.checked)} className="rounded text-emerald-600" />
                Buka 24 Jam
              </label>
            )}
          </div>

          {/* Dynamic Category Specific Fields (DB-Driven) */}
          {customFields.length > 0 && (
            <div className="sm:col-span-2 border-t border-emerald-100/60 pt-4 mt-2">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-emerald-500 rounded-full"></span>
                Atribut Khusus Per Kategori ({categoryName})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/20 border border-emerald-100/40 p-4 rounded-2xl">
                {customFields.map((field) => {
                  if (field.type === 'spesialis_list') {
                    return (
                      <div key={field.name} className="sm:col-span-2 border-b border-emerald-100/40 pb-3 mb-2 last:border-0 last:pb-0 last:mb-0">
                        <MasterRowPicker
                          mode="spesialis"
                          masterOptions={masterSpesialis}
                          rows={Array.isArray(atributKhusus[field.name]) ? atributKhusus[field.name] : []}
                          onChange={(val) => setCustomValue(field.name, val)}
                          masterLabel="Pilih Spesialisasi"
                          extraLabel="Nama Dokter"
                          extraPlaceholder="Nama dokter (contoh: dr. Budi)"
                        />
                      </div>
                    );
                  }
                  if (field.type === 'fasilitas_list') {
                    return (
                      <div key={field.name} className="sm:col-span-2 border-b border-emerald-100/40 pb-3 mb-2 last:border-0 last:pb-0 last:mb-0">
                        <MasterRowPicker
                          mode="fasilitas"
                          masterOptions={masterJenisFasilitas}
                          rows={Array.isArray(atributKhusus[field.name]) ? atributKhusus[field.name] : []}
                          onChange={(val) => setCustomValue(field.name, val)}
                          masterLabel="Pilih Jenis Fasilitas"
                          extraLabel="Keterangan"
                          extraPlaceholder="Keterangan (contoh: Lantai 2)"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={field.name}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.placeholder || `Ketik ${field.label}...`}
                        className={inputCls}
                        value={atributKhusus[field.name] || ''}
                        onChange={(e) => setCustomValue(field.name, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
            <textarea rows={2} className={inputCls} value={form.deskripsi} onChange={(e) => set('deskripsi', e.target.value)} />
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

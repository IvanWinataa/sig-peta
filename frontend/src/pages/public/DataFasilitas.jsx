import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Clock, Mail, Shield, MapPin } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import { getKategori, getFasilitas, getSpesialis, getJenisFasilitas } from '../../services/publicService';
import { CategoryIcon } from '../../utils/categoryIcons';
import { formatSpesialisDisplay, formatFasilitasDisplay } from '../../utils/facilityJson';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

// Halaman untuk menampilkan tabel data fasilitas kesehatan dengan fitur pencarian, filter kategori, pengurutan kolom, dan paginasi
export default function DataFasilitas() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [masterSpesialis, setMasterSpesialis] = useState([]);
  const [masterJenisFasilitas, setMasterJenisFasilitas] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [sort, setSort] = useState('nama_fasilitas');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getKategori().then((r) => setKategori(r.data.data));
    getSpesialis().then((r) => setMasterSpesialis(r.data.data));
    getJenisFasilitas().then((r) => setMasterJenisFasilitas(r.data.data));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getFasilitas({
          page,
          limit: 10,
          search: search || undefined,
          kategori_id: kategoriId || undefined,
          sort,
          order,
        });
        setData(res.data.data);
        setMeta(res.data.meta);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [page, search, kategoriId, sort, order]);

  // Fungsi untuk mengubah jenis kolom pengurutan (sort) atau arah pengurutannya (asc/desc) saat kolom diklik
  const toggleSort = (col) => {
    if (sort === col) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSort(col); setOrder('asc'); }
    setPage(1);
    setExpandedId(null);
  };

  // Komponen pembantu untuk merender header kolom tabel (th) yang interaktif untuk pengurutan data
  const SortTh = ({ col, children }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => toggleSort(col)}
    >
      {children} {sort === col ? (order === 'asc' ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Fasilitas Kesehatan Bali</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cari..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); setExpandedId(null); }}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
            />
          </div>
          <select
            value={kategoriId}
            onChange={(e) => { setKategoriId(e.target.value); setPage(1); setExpandedId(null); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
          >
            <option value="">Semua Kategori</option>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>{k.nama_kategori}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <SortTh col="nama_fasilitas">Nama</SortTh>
                  <SortTh col="kategori">Kategori</SortTh>
                  <SortTh col="alamat">Alamat</SortTh>
                  
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">24 Jam</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Telepon</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-16">Detail</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500">Memuat...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada data</td></tr>
                ) : (
                  data.map((row) => {
                    const isExpanded = expandedId === row.id;

                    // Parse atribut_khusus
                    let atributKhusus = {};
                    if (row.atribut_khusus) {
                      try {
                        atributKhusus = typeof row.atribut_khusus === 'string'
                          ? JSON.parse(row.atribut_khusus)
                          : row.atribut_khusus;
                      } catch (e) {
                        console.error('Failed to parse atribut_khusus', e);
                      }
                    }

                    // Resolve category schema labels and types
                    const selectedCategory = kategori.find((k) => k.nama_kategori === row.nama_kategori);
                    let attributeLabels = {};
                    let attributeTypes = {};
                    if (selectedCategory && selectedCategory.skema_atribut) {
                      try {
                        const skema = typeof selectedCategory.skema_atribut === 'string'
                          ? JSON.parse(selectedCategory.skema_atribut)
                          : selectedCategory.skema_atribut;
                        if (Array.isArray(skema)) {
                          skema.forEach((field) => {
                            attributeLabels[field.name] = field.label;
                            attributeTypes[field.name] = field.type;
                          });
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }

                    const fotoUrl = row.foto
                      ? row.foto.startsWith('http')
                        ? row.foto
                        : `${API_BASE}${row.foto}`
                      : null;

                    return (
                      <tr key={row.id} className="contents">
                        <tr
                          className={`border-b border-gray-50 hover:bg-slate-50/80 transition-colors cursor-pointer select-none ${
                            isExpanded ? 'bg-slate-50/80 font-medium' : ''
                          }`}
                          onClick={() => setExpandedId(isExpanded ? null : row.id)}
                        >
                          <td className="px-4 py-3 font-semibold text-slate-800">{row.nama_fasilitas}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                              <CategoryIcon iconKey={row.icon_marker} className="w-4 h-4" style={{ color: row.warna_marker }} />
                              {row.nama_kategori}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{row.alamat}</td>
                          <td className="px-4 py-3">{row.bpjs ? <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full shadow-sm">Ya</span> : '—'}</td>
                          <td className="px-4 py-3">{row.status_24_jam ? <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full shadow-sm">Ya</span> : '—'}</td>
                          <td className="px-4 py-3 text-slate-600 font-medium">{row.no_telepon || '—'}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              className="p-1 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-700 outline-none"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-teal-600' : ''
                                }`}
                              />
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-slate-50/20 border-b border-slate-100">
                            <td colSpan={7} className="px-6 py-5">
                              <div className="flex flex-col lg:flex-row gap-6 text-slate-600">
                                {/* 1. Base details column */}
                                <div className="flex-1 space-y-3.5 min-w-[200px]">
                                  <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 border-b border-slate-200/50 pb-1.5 flex items-center gap-1">
                                    <span className="w-1.5 h-3 bg-teal-500 rounded-full"></span>
                                    Informasi Umum & Kontak
                                  </h4>
                                  <p className="flex gap-2.5 items-center text-xs">
                                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="font-semibold text-slate-700 min-w-[80px]">Jam Buka:</span> {row.jam_operasional || '—'}
                                  </p>
                                  {row.email && (
                                    <p className="flex gap-2.5 items-center text-xs">
                                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                      <span className="font-semibold text-slate-700 min-w-[80px]">Email:</span> {row.email}
                                    </p>
                                  )}
                                  <p className="flex gap-2.5 items-center text-xs">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="font-semibold text-slate-700 min-w-[80px]">Koordinat:</span> {row.latitude}, {row.longitude}
                                  </p>
                                  <p className="flex gap-2.5 items-center text-xs">
                                    <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="font-semibold text-slate-700 min-w-[80px]">Pembuat:</span> {row.nama_pembuat || 'Sistem'}
                                  </p>

                                  {/* Legacy Dokter Spesialis list from DB column */}
                                  {(() => {
                                    const lines = formatSpesialisDisplay(row.dokter_spesialis, masterSpesialis);
                                    if (lines.length === 0) return null;
                                    return (
                                      <div className="pt-2 border-t border-slate-100 text-xs">
                                        <span className="block font-semibold text-slate-700 mb-1">Dokter Spesialis:</span>
                                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500 bg-white/60 p-2 rounded-xl border border-slate-100/50 shadow-sm">
                                          {lines.map((line, idx) => <li key={idx}>{line}</li>)}
                                        </ul>
                                      </div>
                                    );
                                  })()}

                                  {/* Legacy Fasilitas Tersedia list from DB column */}
                                  {(() => {
                                    const lines = formatFasilitasDisplay(row.fasilitas, masterJenisFasilitas);
                                    if (lines.length === 0) return null;
                                    return (
                                      <div className="pt-2 border-t border-slate-100 text-xs">
                                        <span className="block font-semibold text-slate-700 mb-1">Fasilitas Tersedia:</span>
                                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500 bg-white/60 p-2 rounded-xl border border-slate-100/50 shadow-sm">
                                          {lines.map((line, idx) => <li key={idx}>{line}</li>)}
                                        </ul>
                                      </div>
                                    );
                                  })()}

                                  {row.deskripsi && (
                                    <div className="pt-2 border-t border-slate-100 text-xs">
                                      <span className="block font-semibold text-slate-700 mb-1">Deskripsi:</span>
                                      <p className="text-slate-500 italic leading-relaxed bg-white/60 p-2.5 rounded-xl border border-slate-100/50 shadow-sm">{row.deskripsi}</p>
                                    </div>
                                  )}
                                </div>

                                {/* 2. Custom attributes column */}
                                <div className="flex-1 space-y-3.5 min-w-[260px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                                  <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 border-b border-slate-200/50 pb-1.5 flex items-center gap-1">
                                    <span className="w-1.5 h-3 bg-teal-500 rounded-full"></span>
                                    Detail Atribut ({row.nama_kategori})
                                  </h4>
                                  {Object.keys(atributKhusus).length === 0 ? (
                                    <p className="text-slate-400 italic text-xs">Tidak ada atribut khusus untuk kategori ini.</p>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 bg-white/60 p-3 rounded-2xl border border-slate-100/50 shadow-sm text-xs">
                                      {Object.entries(atributKhusus).map(([key, val]) => {
                                        if (val === null || val === '' || (Array.isArray(val) && val.length === 0)) return null;
                                        const label = attributeLabels[key] || key.replace(/_/g, ' ').toUpperCase();

                                        // Format website link
                                        if (key === 'website' && typeof val === 'string' && val.startsWith('http')) {
                                          return (
                                            <div key={key} className="col-span-2 flex flex-col gap-0.5 border-b border-slate-100/50 pb-1.5 last:border-0 last:pb-0">
                                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</span>
                                              <a href={val} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold hover:underline truncate">
                                                {val.replace(/^https?:\/\/(www\.)?/, '')}
                                              </a>
                                            </div>
                                          );
                                        }

                                        // Handle spesialis_list
                                        if (attributeTypes[key] === 'spesialis_list') {
                                          const lines = formatSpesialisDisplay(val, masterSpesialis);
                                          if (lines.length === 0) return null;
                                          return (
                                            <div key={key} className="col-span-2 flex flex-col gap-1 border-b border-slate-100/50 pb-2 last:border-0 last:pb-0">
                                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">{label}</span>
                                              <ul className="list-disc pl-4 space-y-0.5 text-slate-800 font-semibold">
                                                {lines.map((line, idx) => (
                                                  <li key={idx}>{line}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          );
                                        }

                                        // Handle fasilitas_list
                                        if (attributeTypes[key] === 'fasilitas_list') {
                                          const lines = formatFasilitasDisplay(val, masterJenisFasilitas);
                                          if (lines.length === 0) return null;
                                          return (
                                            <div key={key} className="col-span-2 flex flex-col gap-1 border-b border-slate-100/50 pb-2 last:border-0 last:pb-0">
                                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">{label}</span>
                                              <ul className="list-disc pl-4 space-y-0.5 text-slate-800 font-semibold">
                                                {lines.map((line, idx) => (
                                                  <li key={idx}>{line}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          );
                                        }

                                        // Format Currency
                                        let displayVal = val;
                                        if (key === 'biaya_konsultasi' || key === 'biaya_terapi') {
                                          const num = Number(val);
                                          displayVal = isNaN(num) ? val : `Rp ${num.toLocaleString('id-ID')}`;
                                        }

                                        const isLongVal = typeof displayVal === 'string' && displayVal.length > 25;
                                        return (
                                          <div key={key} className={`${isLongVal ? 'col-span-2' : 'col-span-1'} flex flex-col gap-0.5 border-b border-slate-100/50 pb-1.5 last:border-0 last:pb-0`}>
                                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">{label}</span>
                                            <span className="text-slate-800 font-bold">{displayVal}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* 3. Photo column */}
                                {fotoUrl && (
                                  <div className="w-full lg:w-[220px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 flex flex-col">
                                    <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2.5 border-b border-slate-200/50 pb-1.5 flex items-center gap-1">
                                      <span className="w-1.5 h-3 bg-teal-500 rounded-full"></span>
                                      Foto Lokasi
                                    </h4>
                                    <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white p-1">
                                      <img
                                        src={fotoUrl}
                                        alt={row.nama_fasilitas}
                                        className="w-full h-32 object-cover rounded-xl"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tr >
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-600">
            <span>Total {meta.total} fasilitas</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span>Hal {page} / {meta.totalPages}</span>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

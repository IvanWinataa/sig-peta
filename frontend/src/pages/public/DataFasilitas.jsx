import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import { getKategori, getFasilitas } from '../../services/publicService';
import { CategoryIcon } from '../../utils/categoryIcons';

export default function DataFasilitas() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [sort, setSort] = useState('nama_fasilitas');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKategori().then((r) => setKategori(r.data.data));
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

  const toggleSort = (col) => {
    if (sort === col) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSort(col); setOrder('asc'); }
    setPage(1);
  };

  const SortTh = ({ col, children }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <select
            value={kategoriId}
            onChange={(e) => { setKategoriId(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">BPJS</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">24 Jam</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Telepon</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Memuat...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada data</td></tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{row.nama_fasilitas}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <CategoryIcon iconKey={row.icon_marker} className="w-4 h-4" style={{ color: row.warna_marker }} />
                          {row.nama_kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{row.alamat}</td>
                      <td className="px-4 py-3">{row.bpjs ? <span className="text-emerald-600 font-medium">Ya</span> : '—'}</td>
                      <td className="px-4 py-3">{row.status_24_jam ? <span className="text-orange-600 font-medium">Ya</span> : '—'}</td>
                      <td className="px-4 py-3">{row.no_telepon || '—'}</td>
                    </tr>
                  ))
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

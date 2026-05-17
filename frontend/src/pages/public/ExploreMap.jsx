import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import LeafletMap from '../../components/map/LeafletMap';
import CategoryFilter from '../../components/facility/CategoryFilter';
import FacilityList from '../../components/facility/FacilityList';
import FacilityDetailCard from '../../components/facility/FacilityDetailCard';
import FacilityModal from '../../components/facility/FacilityModal';
import { getKategori, getFasilitas, getSpesialis, getJenisFasilitas } from '../../services/publicService';
import { createFasilitas, updateFasilitas, deleteFasilitas } from '../../services/privateService';
import { useAuth } from '../../context/AuthContext';

export default function ExploreMap() {
  const { user } = useAuth();
  const [kategori, setKategori] = useState([]);
  const [masterSpesialis, setMasterSpesialis] = useState([]);
  const [masterJenisFasilitas, setMasterJenisFasilitas] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [routing, setRouting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [katRes, spRes, jfRes, facRes] = await Promise.all([
        getKategori(),
        getSpesialis(),
        getJenisFasilitas(),
        getFasilitas({ limit: 500 }),
      ]);
      setKategori(katRes.data.data);
      setMasterSpesialis(spRes.data.data);
      setMasterJenisFasilitas(jfRes.data.data);
      setFacilities(facRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    let list = facilities;
    if (selectedKategori.length) {
      list = list.filter((f) => selectedKategori.includes(f.kategori_id));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.nama_fasilitas?.toLowerCase().includes(q) ||
          f.alamat?.toLowerCase().includes(q) ||
          f.nama_kategori?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [facilities, selectedKategori, search]);

  const activeFacility = filtered.find((f) => f.id === activeId) || facilities.find((f) => f.id === activeId);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolocation');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert('Izinkan akses lokasi di browser')
    );
  };

  const handleMapClick = (latlng) => {
    if (!user) {
      alert('Login terlebih dahulu untuk menambah marker');
      return;
    }
    setEditing({
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6),
    });
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await updateFasilitas(editing.id, formData);
      } else {
        await createFasilitas(formData);
      }
      setModalOpen(false);
      setEditing(null);
      await loadData();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeFacility || !window.confirm('Hapus fasilitas ini?')) return;
    try {
      await deleteFasilitas(activeFacility.id);
      setActiveId(null);
      await loadData();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal menghapus');
    }
  };

  const canEdit = user && activeFacility && (user.role === 'admin' || activeFacility.created_by === user.id);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Topbar
        editMode={editMode}
        onToggleEditMode={() => setEditMode((m) => !m)}
        onLocateMe={handleLocate}
      />

      <div className="flex flex-1 min-h-0 relative">
        {/* Peta tengah — ditaruh paling bawah (z-0) agar panel bisa melayang */}
        <main className="absolute inset-0 z-0 bg-slate-100">
          <LeafletMap
            facilities={filtered}
            activeId={activeId}
            onMarkerClick={(f) => setActiveId(f.id)}
            onMapClick={handleMapClick}
            editMode={editMode && !!user}
            userLocation={userLocation}
            showRoute={routing}
            routeTarget={activeFacility}
          />
        </main>

        {/* Sidebar kiri (Floating) */}
        <aside className="w-[320px] shrink-0 glass-panel flex flex-col z-10 m-4 rounded-3xl overflow-hidden shadow-2xl transition-all">
          <div className="p-4 border-b border-slate-200/50 space-y-3 bg-white/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari fasilitas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none shadow-sm transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            <CategoryFilter kategori={kategori} selectedIds={selectedKategori} onChange={setSelectedKategori} />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p className="text-sm text-gray-500 text-center">Memuat data...</p>
            ) : (
              <FacilityList
                facilities={filtered}
                activeId={activeId || hoverId}
                onSelect={(f) => setActiveId(f.id)}
                onHover={setHoverId}
              />
            )}
          </div>
        </aside>

        {/* Spacer agar kanan bisa diatur ke ujung jika flex */}
        <div className="flex-1 pointer-events-none z-10"></div>

        {/* Panel kanan — detail card (Floating) */}
        <aside className="w-[340px] shrink-0 z-10 m-4 hidden lg:flex flex-col pointer-events-none">
          <div className="glass-panel h-full w-full rounded-3xl overflow-hidden shadow-2xl pointer-events-auto">
            <FacilityDetailCard
              facility={activeFacility}
            masterSpesialis={masterSpesialis}
            masterJenisFasilitas={masterJenisFasilitas}
            onRoute={() => {
              if (!userLocation) {
                handleLocate();
                return;
              }
              setRouting((r) => !r);
            }}
            routing={routing}
            canEdit={canEdit}
              onEdit={() => { setEditing(activeFacility); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          </div>
        </aside>
      </div>

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

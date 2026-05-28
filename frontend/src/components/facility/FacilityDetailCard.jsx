import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Pencil,
  Trash2,
  Stethoscope,
  Building2,
  X,
} from 'lucide-react';
import { CategoryIcon } from '../../utils/categoryIcons';
import { formatSpesialisDisplay, formatFasilitasDisplay } from '../../utils/facilityJson';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

export default function FacilityDetailCard({
  facility,
  masterSpesialis = [],
  masterJenisFasilitas = [],
  kategori = [],
  onRoute,
  onEdit,
  onDelete,
  canEdit = false,
  routing = false,
  onClose,
}) {
  if (!facility) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
        <MapPin className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">Pilih fasilitas dari peta atau daftar untuk melihat detail.</p>
      </div>
    );
  }

  const fotoUrl = facility.foto
    ? facility.foto.startsWith('http')
      ? facility.foto
      : `${API_BASE}${facility.foto}`
    : null;

  const spesialisLines = formatSpesialisDisplay(facility.dokter_spesialis, masterSpesialis);
  const fasilitasLines = formatFasilitasDisplay(facility.fasilitas, masterJenisFasilitas);

  // Parse atribut_khusus
  let atributKhusus = {};
  if (facility.atribut_khusus) {
    try {
      atributKhusus = typeof facility.atribut_khusus === 'string'
        ? JSON.parse(facility.atribut_khusus)
        : facility.atribut_khusus;
    } catch (e) {
      console.error('Failed to parse atribut_khusus', e);
    }
  }

  // Resolve dynamic attribute labels and types from selected category's database-loaded schema
  const selectedCategory = kategori.find((k) => k.nama_kategori === facility.nama_kategori);
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
      console.error('Failed to parse skema_atribut in detail card', e);
    }
  }

  return (
    <div className="card-slide-in flex flex-col h-full p-6">
      {fotoUrl && (
        <div className="relative -mx-6 -mt-6 mb-5 overflow-hidden shadow-sm shrink-0">
          <img
            src={fotoUrl}
            alt={facility.nama_fasilitas}
            className="w-full h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
      )}
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1">{facility.nama_fasilitas}</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all shrink-0 pointer-events-auto cursor-pointer"
            title="Tutup detail"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p
        className="flex items-center gap-2 text-sm font-medium mt-1"
        style={{ color: facility.warna_marker }}
      >
        <CategoryIcon iconKey={facility.icon_marker} className="w-4 h-4" />
        {facility.nama_kategori}
      </p>

      <div className="mt-5 space-y-3.5 text-sm text-slate-600 flex-1 overflow-y-auto px-1">
        <p className="flex gap-2.5">
          <MapPin className="w-4 h-4 shrink-0 text-teal-600 mt-0.5" />
          {facility.alamat}
        </p>
        {facility.no_telepon && (
          <p className="flex gap-2">
            <Phone className="w-4 h-4 shrink-0" />
            {facility.no_telepon}
          </p>
        )}
        {facility.email && (
          <p className="flex gap-2">
            <Mail className="w-4 h-4 shrink-0" />
            {facility.email}
          </p>
        )}
        {facility.jam_operasional && (
          <p className="flex gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            {facility.jam_operasional}
          </p>
        )}
        <div className="flex gap-2 flex-wrap pt-1">
          {facility.bpjs && (
            <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold shadow-sm">
              BPJS Tersedia
            </span>
          )}
          {facility.status_24_jam && (
            <span className="px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold shadow-sm">
              Buka 24 Jam
            </span>
          )}
        </div>
        {/* Dynamic DB-Driven Atribut Khusus Section */}
        {Object.keys(atributKhusus).length > 0 && (
          <div className="border-t border-slate-100 pt-4 mt-3">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Informasi Detail ({facility.nama_kategori})</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl text-xs">
              {Object.entries(atributKhusus).map(([key, val]) => {
                if (val === null || val === '' || (Array.isArray(val) && val.length === 0)) return null;
                
                // Fallback to stylized key name if not found in category schema labels
                const label = attributeLabels[key] || key.replace(/_/g, ' ').toUpperCase();

                // Format website field with links
                if (key === 'website' && typeof val === 'string' && val.startsWith('http')) {
                  return (
                    <div key={key} className="col-span-2 flex flex-col gap-0.5 border-b border-slate-100/50 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">{label}</span>
                      <a href={val} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-semibold hover:underline truncate">
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
                      <span className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">{label}</span>
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
                      <span className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">{label}</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-800 font-semibold">
                        {lines.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                // Format currency for consultation fees
                let displayVal = val;
                if (key === 'biaya_konsultasi' || key === 'biaya_terapi') {
                  const num = Number(val);
                  displayVal = isNaN(num) ? val : `Rp ${num.toLocaleString('id-ID')}`;
                }

                // Handle layout for long values
                const isLongVal = typeof displayVal === 'string' && displayVal.length > 25;
                return (
                  <div key={key} className={`${isLongVal ? 'col-span-2' : 'col-span-1'} flex flex-col gap-0.5 border-b border-slate-100/50 pb-1.5 last:border-0 last:pb-0`}>
                    <span className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">{label}</span>
                    <span className="text-slate-800 font-semibold">{displayVal}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {facility.deskripsi && <p className="text-gray-500">{facility.deskripsi}</p>}
      </div>

      <div className="mt-4 space-y-2 shrink-0">
        <button
          type="button"
          onClick={onRoute}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
            routing
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'bg-teal-600 text-white shadow-teal-600/30 shadow-lg hover:bg-teal-700 hover:shadow-teal-700/40 hover:-translate-y-0.5'
          }`}
        >
          <Navigation className="w-4 h-4" />
          {routing ? 'Hapus Rute' : 'Rute ke Lokasi'}
        </button>
        {canEdit && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

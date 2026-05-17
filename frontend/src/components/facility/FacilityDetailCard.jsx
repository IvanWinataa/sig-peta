import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Navigation,
  Pencil,
  Trash2,
  Stethoscope,
  Building2,
} from 'lucide-react';
import { CategoryIcon } from '../../utils/categoryIcons';
import { formatSpesialisDisplay, formatFasilitasDisplay } from '../../utils/facilityJson';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

export default function FacilityDetailCard({
  facility,
  masterSpesialis = [],
  masterJenisFasilitas = [],
  onRoute,
  onEdit,
  onDelete,
  canEdit = false,
  routing = false,
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
      <h3 className="text-xl font-bold text-gray-900">{facility.nama_fasilitas}</h3>
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
        {facility.rating != null && (
          <p className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {facility.rating}
          </p>
        )}

        {spesialisLines.length > 0 && (
          <div>
            <p className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
              <Stethoscope className="w-4 h-4" /> Dokter Spesialis
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              {spesialisLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {fasilitasLines.length > 0 && (
          <div>
            <p className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
              <Building2 className="w-4 h-4" /> Fasilitas
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              {fasilitasLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
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

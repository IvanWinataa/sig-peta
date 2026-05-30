import {
  Hospital,
  Stethoscope,
  HeartPulse,
  Pill,
  FlaskConical,
  Siren,
  UserRound,
  Ambulance,
  Building2,
} from 'lucide-react';

/** Maps kategori.icon_marker from API to Lucide components */
export const CATEGORY_ICON_MAP = {
  hospital: Hospital,
  clinic: Stethoscope,
  puskesmas: HeartPulse,
  pharmacy: Pill,
  lab: FlaskConical,
  emergency: Siren,
  doctor: UserRound,
  ambulance: Ambulance,
};

// Mengambil komponen ikon Lucide berdasarkan nama string ikon (fallback ke ikon Building2 jika tidak ditemukan)
export function getCategoryIcon(iconKey) {
  return CATEGORY_ICON_MAP[iconKey] || Building2;
}

/** For use in JSX: <CategoryIcon iconKey="hospital" className="w-4 h-4" /> */
// Komponen React untuk menampilkan ikon kategori kesehatan yang sesuai berdasarkan key ikon dari database
export function CategoryIcon({ iconKey, className = 'w-4 h-4', style }) {
  const Icon = getCategoryIcon(iconKey);
  return <Icon className={className} style={style} />;
}


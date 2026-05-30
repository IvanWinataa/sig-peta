import { renderToStaticMarkup } from 'react-dom/server';
import { getCategoryIcon } from './categoryIcons';

const TAG = 'd' + 'iv';

// Membuat dan mengembalikan L.divIcon custom untuk marker fasilitas kesehatan (dengan warna spesifik dan animasi radar jika marker aktif/dipilih)
export function buildLeafletDivIcon(iconKey, color, isActive, L) {
  const Icon = getCategoryIcon(iconKey);
  const svg = renderToStaticMarkup(
    <Icon size={18} color="#ffffff" strokeWidth={2.5} />
  );
  const activeClass = isActive ? ' active' : '';

  let html;
  if (isActive) {
    html = [
      `<${TAG} class="marker-radar-wrap" style="--marker-glow:${color}">`,
      `<${TAG} class="radar-ring radar-ring-1"></${TAG}>`,
      `<${TAG} class="radar-ring radar-ring-2"></${TAG}>`,
      `<${TAG} class="radar-ring radar-ring-3"></${TAG}>`,
      `<${TAG} class="marker-pin${activeClass}" style="background:${color};--marker-glow:${color}">`,
      `<${TAG} class="marker-pin-inner">${svg}</${TAG}>`,
      `</${TAG}>`,
      `</${TAG}>`,
    ].join('');
  } else {
    html = [
      `<${TAG} class="marker-pin${activeClass}" style="background:${color};--marker-glow:${color}">`,
      `<${TAG} class="marker-pin-inner">${svg}</${TAG}>`,
      `</${TAG}>`,
    ].join('');
  }

  return L.divIcon({
    html,
    className: isActive ? 'custom-facility-marker marker-with-radar' : 'custom-facility-marker',
    iconSize: isActive ? [80, 80] : [36, 36],
    iconAnchor: isActive ? [40, 72] : [18, 36],
    popupAnchor: [0, -36],
  });
}

// Membuat dan mengembalikan L.divIcon khusus berupa dot biru berkedip (pulsing) untuk menunjukkan lokasi geolocation pengguna saat ini
export function buildUserLocationIcon(L) {
  const html = `<${TAG} class="user-location-pulse" style="width:16px;height:16px;"></${TAG}>`;
  return L.divIcon({
    html,
    className: 'user-location-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

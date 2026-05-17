/** Parse dokter_spesialis / fasilitas dari DB (JSON string atau legacy teks) */

export function parseSpesialisList(raw) {
  if (!raw) return [];
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(data)) {
      return data.map((item) => ({
        spesialis_id: item.spesialis_id ?? item.id ?? '',
        nama_dokter: item.nama_dokter || '',
      }));
    }
  } catch {
    /* legacy: "Dalam, Anak" */
    return String(raw)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((nama) => ({ spesialis_id: '', nama_dokter: nama }));
  }
  return [];
}

export function parseFasilitasList(raw) {
  if (!raw) return [];
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(data)) {
      return data.map((item) => ({
        jenis_id: item.jenis_id ?? item.id ?? '',
        keterangan: item.keterangan || '',
      }));
    }
  } catch {
    return String(raw)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((nama) => ({ jenis_id: '', keterangan: nama }));
  }
  return [];
}

export function formatSpesialisDisplay(raw, masterList = []) {
  const items = parseSpesialisList(raw);
  return items.map((item) => {
    const master = masterList.find((m) => m.id === item.spesialis_id || m.id === Number(item.spesialis_id));
    const label = master?.nama_spesialis || 'Spesialis';
    return item.nama_dokter ? `${label}: ${item.nama_dokter}` : label;
  });
}

export function formatFasilitasDisplay(raw, masterList = []) {
  const items = parseFasilitasList(raw);
  return items.map((item) => {
    const master = masterList.find((m) => m.id === item.jenis_id || m.id === Number(item.jenis_id));
    const label = master?.nama_jenis || 'Fasilitas';
    return item.keterangan ? `${label} — ${item.keterangan}` : label;
  });
}

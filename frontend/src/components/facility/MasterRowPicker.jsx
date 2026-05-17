import { Plus, Trash2 } from 'lucide-react';

const inputCls =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none';

/**
 * Baris dropdown + field tambahan (nama dokter / keterangan)
 * @param {'spesialis'|'fasilitas'} mode
 */
export default function MasterRowPicker({
  mode,
  masterOptions = [],
  rows = [],
  onChange,
  masterLabel = 'Pilih',
  extraLabel = 'Keterangan',
  extraPlaceholder = '',
}) {
  const idKey = mode === 'spesialis' ? 'spesialis_id' : 'jenis_id';
  const extraKey = mode === 'spesialis' ? 'nama_dokter' : 'keterangan';
  const optionLabel = mode === 'spesialis' ? 'nama_spesialis' : 'nama_jenis';

  const addRow = () => {
    onChange([...rows, { [idKey]: '', [extraKey]: '' }]);
  };

  const updateRow = (index, field, value) => {
    const next = rows.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    onChange(next);
  };

  const removeRow = (index) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-600">
          {mode === 'spesialis' ? 'Dokter Spesialis' : 'Fasilitas Tersedia'}
        </label>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah baris
        </button>
      </div>

      {rows.length === 0 && (
        <p className="text-xs text-gray-400 italic">Belum ada data. Klik &quot;Tambah baris&quot;.</p>
      )}

      {rows.map((row, index) => (
        <div key={index} className="flex gap-2 items-start">
          <select
            className={`${inputCls} flex-1 min-w-0`}
            value={row[idKey] ?? ''}
            onChange={(e) => updateRow(index, idKey, e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">{masterLabel}</option>
            {masterOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m[optionLabel]}
              </option>
            ))}
          </select>
          <input
            type="text"
            className={`${inputCls} flex-1 min-w-0`}
            placeholder={
              mode === 'spesialis'
                ? extraPlaceholder || 'Nama dokter (contoh: dr. Budi)'
                : extraPlaceholder || 'Keterangan (contoh: Lantai 2)'
            }
            value={row[extraKey] || ''}
            onChange={(e) => updateRow(index, extraKey, e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-0.5"
            aria-label="Hapus baris"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

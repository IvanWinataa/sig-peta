import { CategoryIcon } from '../../utils/categoryIcons';

export default function CategoryFilter({ kategori = [], selectedIds = [], onChange }) {
  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => onChange([]);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={selectAll}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
          selectedIds.length === 0
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
        }`}
      >
        Semua
      </button>
      {kategori.map((k) => {
        const active = selectedIds.includes(k.id);
        return (
          <button
            key={k.id}
            type="button"
            onClick={() => toggle(k.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              active
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
            style={active ? { backgroundColor: k.warna_marker, borderColor: k.warna_marker } : {}}
          >
            <CategoryIcon iconKey={k.icon_marker} className="w-3.5 h-3.5" />
            {k.nama_kategori}
          </button>
        );
      })}
    </div>
  );
}


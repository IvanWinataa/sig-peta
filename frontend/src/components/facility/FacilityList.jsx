import { useEffect, useRef } from 'react';
import { Check, Clock } from 'lucide-react';
import { CategoryIcon } from '../../utils/categoryIcons';

export default function FacilityList({
  facilities,
  activeId,
  onSelect,
  onHover,
}) {
  const listRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (activeId && itemRefs.current[activeId]) {
      itemRefs.current[activeId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId]);

  if (!facilities.length) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">Tidak ada fasilitas ditemukan.</p>
    );
  }

  return (
    <ul ref={listRef} className="space-y-2">
      {facilities.map((f) => {
        const active = f.id === activeId;
        return (
          <li
            key={f.id}
            ref={(el) => { itemRefs.current[f.id] = el; }}
          >
            <button
              type="button"
              onClick={() => onSelect(f)}
              onMouseEnter={() => onHover?.(f.id)}
              onMouseLeave={() => onHover?.(null)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                active
                  ? 'border-l-4 border-l-emerald-500 bg-emerald-50 border-emerald-200 shadow-sm'
                  : 'border-gray-100 bg-white hover:bg-sky-50 hover:border-sky-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                  style={{ backgroundColor: `${f.warna_marker}22`, color: f.warna_marker }}
                >
                  <CategoryIcon iconKey={f.icon_marker} className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-gray-900 truncate">{f.nama_fasilitas}</p>
                  <p className="text-xs text-gray-500 truncate">{f.alamat}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {f.nama_kategori}
                    </span>
                    {f.bpjs && (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        <Check className="w-3 h-3" /> BPJS
                      </span>
                    )}
                    {f.status_24_jam && (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                        <Clock className="w-3 h-3" /> 24 Jam
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}


import { useEffect, useRef } from 'react';
import { Check, Clock } from 'lucide-react';
import { CategoryIcon } from '../../utils/categoryIcons';

// Komponen React untuk menampilkan daftar list fasilitas kesehatan pada sidebar sebelah kiri peta dengan fitur klik & hover item
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
              className={`w-full text-left p-3.5 rounded-2xl border transition-all hover-lift ${
                active
                  ? 'border-l-4 border-l-teal-500 bg-teal-50 border-teal-200 shadow-md ring-1 ring-teal-500/20'
                  : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300'
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
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                        <Check className="w-3 h-3" /> BPJS
                      </span>
                    )}
                    {f.status_24_jam && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
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


import { Link } from 'react-router-dom';
import { Map, Navigation, Table, Hospital, Stethoscope, Pill } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sky-50">
      <Topbar />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Temukan Fasilitas Kesehatan di <span className="text-emerald-600">Bali</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            HealthMap Bali membantu masyarakat, mahasiswa rantau, dan wisatawan menemukan rumah sakit,
            klinik, puskesmas, apotek, dan layanan kesehatan lainnya dengan peta interaktif.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200"
            >
              Jelajahi Peta
            </Link>
            <Link
              to="/data-fasilitas"
              className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-xl border-2 border-emerald-500 hover:bg-emerald-50"
            >
              Lihat Data
            </Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: Map, title: 'Peta Interaktif', desc: 'Marker cluster & filter kategori dengan ikon Lucide per jenis fasilitas.' },
            { icon: Navigation, title: 'Navigasi Rute', desc: 'Routing dari lokasi Anda ke fasilitas kesehatan terpilih.' },
            { icon: Table, title: 'Data Lengkap', desc: 'Tabel fasilitas dengan search, sort, dan pagination.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Icon className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-2">{desc}</p>
            </div>
          ))}
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <p className="text-center text-sm text-gray-500 mb-4">Kategori fasilitas kesehatan</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { Icon: Hospital, label: 'Rumah Sakit', color: '#EF4444' },
              { Icon: Stethoscope, label: 'Klinik', color: '#3B82F6' },
              { Icon: Pill, label: 'Apotek', color: '#22C55E' },
            ].map(({ Icon, label, color }) => (
              <span
                key={label}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm text-sm font-medium"
                style={{ color }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Map, Navigation, Table, Hospital, Stethoscope, Pill, ArrowRight, HeartPulse, FlaskConical, UserRound } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';

// Komponen Halaman Utama (Landing Page) yang berisi ringkasan fitur, logo kategori kesehatan, dan tombol navigasi utama
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 w-full h-[600px] -translate-x-1/2 bg-gradient-to-b from-teal-500/10 via-sky-500/5 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-sky-400/20 rounded-full blur-[120px] pointer-events-none" />

      <Topbar />

      <main className="flex-1 relative z-10">
        <section className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-bold mb-8 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse shadow-lg shadow-teal-500" />
            Sistem Informasi Geografis Terpadu
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            Temukan Fasilitas <br className="hidden md:block" /> Kesehatan di <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-500">Bali</span>
          </h1>
          <p className="mt-8 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            BaliCare Map membantu masyarakat, mahasiswa rantau, dan wisatawan menemukan rumah sakit,
            klinik, puskesmas, apotek, dan layanan kesehatan lainnya dengan antarmuka yang modern dan cepat.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="group flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-700 shadow-xl shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all"
            >
              Jelajahi Peta <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/data-fasilitas"
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
            >
              Lihat Data Tabel
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
          {[
            { icon: Map, title: 'Peta Interaktif', desc: 'Sistem marker cerdas dengan pengelompokan (cluster) untuk navigasi yang lebih rapi dan intuitif.', color: 'text-teal-600', bg: 'bg-teal-50' },
            { icon: Navigation, title: 'Navigasi Rute', desc: 'Dapatkan rute perjalanan terbaik dari lokasi Anda saat ini menuju fasilitas.', color: 'text-sky-600', bg: 'bg-sky-50' },
            { icon: Table, title: 'Data Lengkap', desc: 'Informasi komprehensif mulai dari jadwal, penerimaan BPJS, spesialis, hingga buka 24 jam.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="glass-panel p-8 rounded-3xl hover-lift">
              <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-slate-600 mt-3 leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-28 text-center">
          <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">Mencakup Berbagai Kategori</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { Icon: Hospital, label: 'Rumah Sakit', color: '#EF4444', bg: '#FEF2F2' },
              { Icon: Stethoscope, label: 'Klinik', color: '#0EA5E9', bg: '#F0F9FF' },
              { Icon: Pill, label: 'Apotek', color: '#10B981', bg: '#ECFDF5' },
              { Icon: HeartPulse, label: 'Puskesmas', color: '#0EA5E9', bg: '#F0F9FF' },
              { Icon: FlaskConical, label: 'Laboratorium', color: '#10B981', bg: '#ECFDF5' },
              { Icon: UserRound, label: 'Dokter Praktik', color: '#10B981', bg: '#ECFDF5' },
            ].map(({ Icon, label, color, bg }) => (
              <span
                key={label}
                className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm font-bold transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default text-slate-700"
              >
                <span className="p-2.5 rounded-xl" style={{ backgroundColor: bg, color }}>
                  <Icon className="w-5 h-5" />
                </span>
                {label}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { register } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ nama: form.nama, email: form.email, password: form.password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xl mb-6">
          <MapPin className="w-7 h-7" />
          HealthMap Bali
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900">Daftar Akun</h1>

        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama</label>
            <input required className={inputCls} value={form.nama} onChange={(e) => set('nama', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input type="email" required className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input type="password" required minLength={6} className={inputCls} value={form.password} onChange={(e) => set('password', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Konfirmasi Password</label>
            <input type="password" required className={inputCls} value={form.confirm} onChange={(e) => set('confirm', e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun? <Link to="/login" className="text-emerald-600 font-medium">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

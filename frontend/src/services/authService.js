import api from './api';

// Mengirim data registrasi user baru ke endpoint pendaftaran backend
export const register = (data) => api.post('/auth/register', data);
// Mengirim kredensial email dan password ke endpoint login backend untuk mendapatkan token JWT
export const login = (data) => api.post('/auth/login', data);
// Mengambil profil data diri pengguna yang aktif berdasarkan token yang sedang disimpan
export const getMe = () => api.get('/auth/me');


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Interseptor request untuk otomatis menambahkan token JWT ke header Authorization jika tersedia
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthmap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interseptor respons untuk mendeteksi error 401 (tidak sah) secara global dan mengalihkan pengguna ke halaman login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healthmap_token');
      localStorage.removeItem('healthmap_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


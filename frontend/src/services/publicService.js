import api from './api';

// Mengambil daftar kategori beserta skema atributnya dari database untuk konsumsi publik
export const getKategori = () => api.get('/public/kategori');
// Mengambil daftar master dokter spesialis yang tersedia (publik)
export const getSpesialis = () => api.get('/public/spesialis');
// Mengambil daftar master jenis fasilitas kesehatan yang tersedia (publik)
export const getJenisFasilitas = () => api.get('/public/jenis-fasilitas');
// Mengambil daftar fasilitas kesehatan publik dengan filter, pencarian, dan paginasi
export const getFasilitas = (params) => api.get('/public/fasilitas', { params });


import api from './api';

export const getKategori = () => api.get('/public/kategori');
export const getSpesialis = () => api.get('/public/spesialis');
export const getJenisFasilitas = () => api.get('/public/jenis-fasilitas');
export const getFasilitas = (params) => api.get('/public/fasilitas', { params });
export const getFasilitasById = (id) => api.get(`/public/fasilitas/${id}`);


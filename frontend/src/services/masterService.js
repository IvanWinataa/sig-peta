import api from './api';

// Mengambil seluruh master dokter spesialis dari backend untuk dikelola oleh admin
export const getSpesialisAdmin = () => api.get('/admin/spesialis');
// Membuat jenis/bidang dokter spesialis baru
export const createSpesialis = (data) => api.post('/admin/spesialis', data);
// Memperbarui nama spesialisasi dokter berdasarkan ID spesialis
export const updateSpesialis = (id, data) => api.put(`/admin/spesialis/${id}`, data);
// Menghapus data master dokter spesialis berdasarkan ID spesialis
export const deleteSpesialis = (id) => api.delete(`/admin/spesialis/${id}`);

// Mengambil seluruh master jenis fasilitas dari backend untuk dikelola oleh admin
export const getJenisFasilitasAdmin = () => api.get('/admin/jenis-fasilitas');
// Membuat jenis fasilitas baru (misalnya UGD, Radiologi, Farmasi)
export const createJenisFasilitas = (data) => api.post('/admin/jenis-fasilitas', data);
// Memperbarui nama jenis fasilitas berdasarkan ID jenis fasilitas
export const updateJenisFasilitas = (id, data) => api.put(`/admin/jenis-fasilitas/${id}`, data);
// Menghapus data master jenis fasilitas berdasarkan ID jenis fasilitas
export const deleteJenisFasilitas = (id) => api.delete(`/admin/jenis-fasilitas/${id}`);

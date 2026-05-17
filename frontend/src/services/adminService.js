import api from './api';

export const getAllFasilitas = (params) => api.get('/admin/all-fasilitas', { params });
export const deleteFasilitasAdmin = (id) => api.delete(`/admin/fasilitas/${id}`);
export const getKategoriAdmin = () => api.get('/admin/kategori');
export const createKategori = (data) => api.post('/admin/kategori', data);
export const updateKategori = (id, data) => api.put(`/admin/kategori/${id}`, data);
export const deleteKategori = (id) => api.delete(`/admin/kategori/${id}`);
export const getUsers = () => api.get('/admin/users');
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);


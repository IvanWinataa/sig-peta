import api from './api';

export const getSpesialis = () => api.get('/public/spesialis');
export const getJenisFasilitas = () => api.get('/public/jenis-fasilitas');

export const getSpesialisAdmin = () => api.get('/admin/spesialis');
export const createSpesialis = (data) => api.post('/admin/spesialis', data);
export const updateSpesialis = (id, data) => api.put(`/admin/spesialis/${id}`, data);
export const deleteSpesialis = (id) => api.delete(`/admin/spesialis/${id}`);

export const getJenisFasilitasAdmin = () => api.get('/admin/jenis-fasilitas');
export const createJenisFasilitas = (data) => api.post('/admin/jenis-fasilitas', data);
export const updateJenisFasilitas = (id, data) => api.put(`/admin/jenis-fasilitas/${id}`, data);
export const deleteJenisFasilitas = (id) => api.delete(`/admin/jenis-fasilitas/${id}`);

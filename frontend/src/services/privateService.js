import api from './api';

export const getMyFasilitas = (params) => api.get('/private/my-fasilitas', { params });

export const createFasilitas = (formData) =>
  api.post('/private/fasilitas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateFasilitas = (id, formData) =>
  api.put(`/private/fasilitas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteFasilitas = (id) => api.delete(`/private/fasilitas/${id}`);


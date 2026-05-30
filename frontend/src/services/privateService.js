import api from './api';

// Mengambil daftar fasilitas kesehatan milik user yang sedang aktif login
export const getMyFasilitas = (params) => api.get('/private/my-fasilitas', { params });

// Mengirim request POST dengan Multipart FormData untuk membuat data fasilitas kesehatan baru beserta foto
export const createFasilitas = (formData) =>
  api.post('/private/fasilitas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Mengirim request PUT dengan Multipart FormData untuk memperbarui data fasilitas kesehatan yang ada beserta foto baru
export const updateFasilitas = (id, formData) =>
  api.put(`/private/fasilitas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Mengirim request DELETE berdasarkan ID fasilitas untuk menghapus data fasilitas kesehatan milik user
export const deleteFasilitas = (id) => api.delete(`/private/fasilitas/${id}`);


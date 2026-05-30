import api from './api';

// Mengambil seluruh data fasilitas kesehatan dari database untuk keperluan panel admin
export const getAllFasilitas = (params) => api.get('/admin/all-fasilitas', { params });
// Mengirim request DELETE untuk menghapus fasilitas kesehatan tertentu dari sisi admin
export const deleteFasilitasAdmin = (id) => api.delete(`/admin/fasilitas/${id}`);
// Mengambil seluruh data kategori dari backend untuk admin
export const getKategoriAdmin = () => api.get('/admin/kategori');
// Membuat kategori fasilitas baru beserta deskripsi atribut dinamisnya
export const createKategori = (data) => api.post('/admin/kategori', data);
// Memperbarui properti kategori, ikon, warna marker, dan atribut dinamis berdasarkan ID kategori
export const updateKategori = (id, data) => api.put(`/admin/kategori/${id}`, data);
// Menghapus data kategori berdasarkan ID kategori
export const deleteKategori = (id) => api.delete(`/admin/kategori/${id}`);
// Mengambil seluruh daftar user untuk ditampilkan dan dikelola oleh admin
export const getUsers = () => api.get('/admin/users');
// Memperbarui nama dan role (admin/user) dari user tertentu berdasarkan ID
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
// Menghapus akun user berdasarkan ID user
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);


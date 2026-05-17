const express = require('express');
const {
  getAllFasilitas,
  deleteFasilitasAdmin,
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/admin.controller');
const {
  getSpesialisAdmin,
  createSpesialis,
  updateSpesialis,
  deleteSpesialis,
  getJenisFasilitasAdmin,
  createJenisFasilitas,
  updateJenisFasilitas,
  deleteJenisFasilitas,
} = require('../controllers/master.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/all-fasilitas', getAllFasilitas);
router.delete('/fasilitas/:id', deleteFasilitasAdmin);

router.get('/kategori', getKategori);
router.post('/kategori', createKategori);
router.put('/kategori/:id', updateKategori);
router.delete('/kategori/:id', deleteKategori);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/spesialis', getSpesialisAdmin);
router.post('/spesialis', createSpesialis);
router.put('/spesialis/:id', updateSpesialis);
router.delete('/spesialis/:id', deleteSpesialis);

router.get('/jenis-fasilitas', getJenisFasilitasAdmin);
router.post('/jenis-fasilitas', createJenisFasilitas);
router.put('/jenis-fasilitas/:id', updateJenisFasilitas);
router.delete('/jenis-fasilitas/:id', deleteJenisFasilitas);

module.exports = router;

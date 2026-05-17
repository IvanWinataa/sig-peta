const express = require('express');
const {
  getKategori,
  getFasilitasList,
  getFasilitasById,
} = require('../controllers/public.controller');
const {
  getSpesialisPublic,
  getJenisFasilitasPublic,
} = require('../controllers/master.controller');

const router = express.Router();

router.get('/kategori', getKategori);
router.get('/spesialis', getSpesialisPublic);
router.get('/jenis-fasilitas', getJenisFasilitasPublic);
router.get('/fasilitas', getFasilitasList);
router.get('/fasilitas/:id', getFasilitasById);

module.exports = router;

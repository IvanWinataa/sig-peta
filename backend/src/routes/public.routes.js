const express = require('express');
const {
  getKategori,
  getFasilitasList,
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

module.exports = router;

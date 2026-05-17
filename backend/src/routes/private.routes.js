const express = require('express');
const {
  createFasilitas,
  updateFasilitas,
  deleteFasilitas,
  getMyFasilitas,
} = require('../controllers/private.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkOwnership } = require('../middleware/ownership.middleware');
const upload = require('../utils/upload');

const router = express.Router();

router.use(authenticate);

router.get('/my-fasilitas', getMyFasilitas);
router.post('/fasilitas', upload.single('foto'), createFasilitas);
router.put('/fasilitas/:id', upload.single('foto'), checkOwnership, updateFasilitas);
router.delete('/fasilitas/:id', checkOwnership, deleteFasilitas);

module.exports = router;

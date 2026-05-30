const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  // Menentukan folder tujuan penyimpanan file upload
  destination: (_req, _file, cb) => cb(null, uploadDir),
  // Membuat nama unik untuk file yang di-upload agar tidak bentrok
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  // Memfilter file upload agar hanya menerima berkas bertipe gambar JPEG, PNG, atau WEBP saja
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format file harus JPG, PNG, atau WEBP'));
  },
});

module.exports = upload;

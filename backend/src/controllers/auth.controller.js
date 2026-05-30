const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const { secret, expiresIn } = require('../config/jwt');

// Membuat dan menandatangani JWT (JSON Web Token) berisi data profil user
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, nama: user.nama },
    secret,
    { expiresIn }
  );
}

// Memformat baris objek user dari database menjadi format respons yang aman (tanpa password)
function userResponse(row) {
  return { id: row.id, nama: row.nama, email: row.email, role: row.role };
}

// Mendaftarkan akun user baru ke database setelah validasi input dan mengenkripsi password
async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
  }

  const { nama, email, password } = req.body;

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(422).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (nama, email, password, role) VALUES ($1, $2, $3, 'user') RETURNING id, nama, email, role`,
      [nama, email, hash]
    );

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: userResponse(result.rows[0]),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Melakukan verifikasi email dan password untuk login serta mengirimkan JWT token jika sukses
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, nama, email, password, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const token = signToken(user);
    return res.json({
      success: true,
      message: 'Login berhasil',
      data: { token, user: userResponse(user) },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// Mengambil profil user yang sedang login berdasarkan ID yang didekode dari JWT token
async function me(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nama, email, role FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    return res.json({ success: true, data: userResponse(result.rows[0]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

module.exports = { register, login, me };

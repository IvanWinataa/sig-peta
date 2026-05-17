const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('nama').trim().isLength({ min: 2 }).withMessage('Nama minimal 2 karakter'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  login
);

router.get('/me', authenticate, me);

module.exports = router;

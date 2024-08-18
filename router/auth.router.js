const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/auth.controllers'); // Mengubah dari 'aunthenticate' menjadi 'authenticate'
const app = require('./admin.router');

// Definisikan rute POST untuk autentikasi
app.post('/', authenticate);

module.exports = app;
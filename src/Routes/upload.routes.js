// routes/upload.routes.js
const express = require('express');
const router = express.Router();
const { uploadLogo } = require('../controllers/upload.controller');
const { upload } = require('../services/uploadService');

// Ruta para subir el logo (método POST)
// El middleware upload.single('logo') indica que el archivo se envía en el campo 'logo'
router.post('/upload-logo', upload.single('logo'), uploadLogo);

module.exports = router;

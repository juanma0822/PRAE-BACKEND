// routes/upload.routes.js
const express = require('express');
const router = express.Router();
const { uploadLogo } = require('../controllers/upload.controller');
const { upload } = require('../services/uploadService');
const verifyToken = require("../middleware/auth.middleware");

// Ruta para subir el logo (método POST)
// El middleware upload.single('logo') indica que el archivo se envía en el campo 'logo'
router.post('/upload-logo', verifyToken, upload.single('logo'), uploadLogo);

module.exports = router;

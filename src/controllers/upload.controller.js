// controllers/upload.controller.js
const { uploadImageToFirebase } = require('../services/uploadService');

/**
 * Controlador para subir el logo de la institución.
 * Se espera que el archivo se envíe en el campo 'logo'
 * y se reciba el id de la institución en req.body.id_institucion
 */
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }
    
    const { id_institucion } = req.body;
    if (!id_institucion) {
      return res.status(400).json({ message: 'Se requiere el id de la institución.' });
    }
    
    // Subir la imagen a Firebase Storage
    const logoUrl = await uploadImageToFirebase(req.file.buffer, req.file.originalname);
    
    // Aquí deberías actualizar el registro de la institución en la base de datos
    // Ejemplo:
    // await institucionService.actualizarLogo(id_institucion, logoUrl);
    
    return res.status(200).json({ message: 'Logo subido con éxito', logoUrl });
  } catch (error) {
    console.error('Error al subir el logo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { uploadLogo };

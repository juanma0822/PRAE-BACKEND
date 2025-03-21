// services/uploadService.js
const multer = require('multer');
const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuración de Multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Función para subir una imagen a Firebase Storage
 * @param {Buffer} fileBuffer - El buffer del archivo
 * @param {string} originalName - El nombre original del archivo
 * @returns {Promise<string>} - URL pública de la imagen
 */
const uploadImageToFirebase = async (fileBuffer, originalName) => {
  // Genera un nombre único para el archivo
  const fileName = `logos/${uuidv4()}${path.extname(originalName)}`;
  const file = bucket.file(fileName);
  
  return new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/jpeg' // O detecta el content-type según tu necesidad
      }
    });
    
    stream.on('error', (error) => {
      reject(error);
    });
    
    stream.on('finish', async () => {
      // Hacer pública la imagen
      await file.makePublic();
      // Construir la URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });
    
    stream.end(fileBuffer);
  });
};

/**
 * Elimina una imagen de Firebase Storage
 * @param {string} imageUrl - URL pública de la imagen a eliminar
 * @returns {Promise<void>}
 */
const deleteImageFromFirebase = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Extraer solo el path del archivo después del bucket
    const bucketName = bucket.name; // Nombre del bucket desde config/firebase
    const filePath = imageUrl.replace(`https://storage.googleapis.com/${bucketName}/`, "");

    // Eliminar la imagen de Firebase Storage
    await bucket.file(filePath).delete();
    console.log(`Imagen eliminada: ${filePath}`);
  } catch (error) {
    console.error("Error al eliminar la imagen de Firebase:", error);
  }
};


module.exports = { upload, uploadImageToFirebase, deleteImageFromFirebase };

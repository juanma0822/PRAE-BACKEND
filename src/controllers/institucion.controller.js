const institucionService = require('../services/institucion.service');
const { uploadImageToFirebase } = require('../services/uploadService')

// Crear una nueva institución
const createInstitucion = async (req, res) => {
  try {
    const { nombre, telefono, instagram, facebook, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3 } = req.body;

    // Subir el logo si se proporciona
    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadImageToFirebase(req.file.buffer, req.file.originalname);
    }

    const nuevaInstitucion = await institucionService.createInstitucion(nombre, telefono, instagram, facebook, logoUrl, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3);
    res.status(201).json(nuevaInstitucion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las instituciones activas
const getAllInstituciones = async (req, res) => {
  try {
    const instituciones = await institucionService.getAllInstituciones();
    res.status(200).json(instituciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una institución por su ID
const getInstitucionById = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const institucion = await institucionService.getInstitucionById(id_institucion);
    res.status(200).json(institucion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una institución
const updateInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const { nombre, telefono, instagram, facebook, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3 } = req.body;
    const institucionActualizada = await institucionService.updateInstitucion(id_institucion, nombre, telefono, instagram, facebook, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3);
    res.status(200).json(institucionActualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desactivar una institución (cambiar estado a false)
const deleteInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const resultado = await institucionService.deleteInstitucion(id_institucion);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const activateInstitucion = async (req, res) => {
    try {
        const {id_institucion} = req.params;
        const resultado = await institucionService.activateInstitucion(id_institucion);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
  createInstitucion,
  getAllInstituciones,
  getInstitucionById,
  updateInstitucion,
  deleteInstitucion,
  activateInstitucion,
};
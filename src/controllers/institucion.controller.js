const institucionService = require("../services/institucion.service");
const {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} = require("../services/uploadService");
const jwt = require("jsonwebtoken");

// Crear una nueva institución
const createInstitucion = async (req, res) => {
  try {
    const {
      nombre,
      telefono,
      instagram,
      facebook,
      direccion,
      color_principal,
      color_secundario,
      fondo,
      color_pildora1,
      color_pildora2,
      color_pildora3,
    } = req.body;

    // Subir el logo si se proporciona
    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadImageToFirebase(
        req.file.buffer,
        req.file.originalname
      );
    }

    const nuevaInstitucion = await institucionService.createInstitucion(
      nombre,
      telefono,
      instagram,
      facebook,
      direccion,
      logoUrl,
      color_principal,
      color_secundario,
      fondo,
      color_pildora1,
      color_pildora2,
      color_pildora3
    );
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
    const institucion = await institucionService.getInstitucionById(
      id_institucion
    );
    res.status(200).json(institucion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una institución
const updateInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const {
      nombre,
      telefono,
      instagram,
      facebook,
      direccion,
      color_principal,
      color_secundario,
      fondo,
      color_pildora1,
      color_pildora2,
      color_pildora3,
    } = req.body;

    // Obtener la institución actual para mantener el logo si no se proporciona uno nuevo
    const institucionActual = await institucionService.getInstitucionById(
      id_institucion
    );
    let logoUrl = institucionActual.logo;

    // Subir el logo si se proporciona
    if (req.file) {
      if (logoUrl) {
        await deleteImageFromFirebase(logoUrl);
      }
      logoUrl = await uploadImageToFirebase(
        req.file.buffer,
        req.file.originalname
      );
    }

    const institucionActualizada = await institucionService.updateInstitucion(
      id_institucion,
      nombre,
      telefono,
      instagram,
      facebook,
      direccion,
      logoUrl,
      color_principal,
      color_secundario,
      fondo,
      color_pildora1,
      color_pildora2,
      color_pildora3
    );
    
    // Generar un nuevo token con los datos actualizados
    const payload = {
      institucion: {
        id_institucion: institucionActualizada.id_institucion,
        nombre: institucionActualizada.nombre,
        telefono: institucionActualizada.telefono,
        instagram: institucionActualizada.instagram,
        facebook: institucionActualizada.facebook,
        logo: institucionActualizada.logo,
        color_principal: institucionActualizada.color_principal,
        color_secundario: institucionActualizada.color_secundario,
        fondo: institucionActualizada.fondo,
        color_pildora1: institucionActualizada.color_pildora1,
        color_pildora2: institucionActualizada.color_pildora2,
        color_pildora3: institucionActualizada.color_pildora3,
        direccion: institucionActualizada.direccion,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.status(200).json({
      message: "Institución actualizada correctamente",
      institucion: institucionActualizada,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desactivar una institución (cambiar estado a false)
const deleteInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const resultado = await institucionService.deleteInstitucion(
      id_institucion
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const activateInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const resultado = await institucionService.activateInstitucion(
      id_institucion
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInstitucion,
  getAllInstituciones,
  getInstitucionById,
  updateInstitucion,
  deleteInstitucion,
  activateInstitucion,
};

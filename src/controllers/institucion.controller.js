const institucionService = require("../services/institucion.service");
const usuarioService = require("../services/usuario.service");
const periodoAcademicoService = require('../services/periodoAcademico.service');
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

    // Crear la institución
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

    // Crear automáticamente 4 periodos académicos para la institución
    const añoActual = new Date().getFullYear();
    const periodos = [
      {
        nombre: "PRIMER PERIODO",
        fecha_inicio: `${añoActual}-01-01`,
        fecha_fin: `${añoActual}-03-31`,
        peso: 25,
      },
      {
        nombre: "SEGUNDO PERIODO",
        fecha_inicio: `${añoActual}-04-01`,
        fecha_fin: `${añoActual}-06-30`,
        peso: 25,
      },
      {
        nombre: "TERCER PERIODO",
        fecha_inicio: `${añoActual}-07-01`,
        fecha_fin: `${añoActual}-09-30`,
        peso: 25,
      },
      {
        nombre: "CUARTO PERIODO",
        fecha_inicio: `${añoActual}-10-01`,
        fecha_fin: `${añoActual}-12-31`,
        peso: 25,
      },
    ];

    for (const periodo of periodos) {
      await periodoAcademicoService.createPeriodoAcademico(
        periodo.nombre,
        añoActual,
        periodo.fecha_inicio,
        periodo.fecha_fin,
        periodo.peso,
        nuevaInstitucion.id_institucion
      );
    }

    res.status(201).json({
      message: "Institución creada exitosamente con 4 periodos académicos por defecto",
      institucion: nuevaInstitucion,
    });
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
    const { documento_identidad, nombre, telefono, instagram, facebook, direccion, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3 } = req.body;

    // Obtener la institución actual para mantener el logo si no se proporciona uno nuevo
    const institucionActual = await institucionService.getInstitucionById(id_institucion);
    let logoUrl = institucionActual.logo;

    // Subir el logo si se proporciona
    if (req.file) {
      if (logoUrl) {
        await deleteImageFromFirebase(logoUrl);
      }
      logoUrl = await uploadImageToFirebase(req.file.buffer, req.file.originalname);
    }

    // Actualizar la institución
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

    // Obtener los datos del administrador
    const admin = await usuarioService.getUsuarioByDocumento(documento_identidad);
    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    // Crear el payload para el token
    const payload = {
      email: admin.correo,
      id: admin.documento_identidad,
      rol: admin.rol,
      nombre: admin.nombre,
      apellido: admin.apellido,
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
        estado: institucionActualizada.estado,
        direccion: institucionActualizada.direccion,
      },
    };

    // Generar un nuevo token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });

    // Responder con la institución actualizada y el nuevo token
    res.status(200).json({
      message: "Institución actualizada correctamente",
      institucion: institucionActualizada,
      token,
    });
  } catch (error) {
    console.error("Error al actualizar la institución:", error);
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

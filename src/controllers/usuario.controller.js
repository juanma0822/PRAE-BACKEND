const usuarioService = require("../services/usuario.service");
const institucionService = require("../services/institucion.service");
const cursoService = require("../services/curso.service");
const emailService = require("../services/emailService");
const {
  emitirEstadisticasInstitucion,
  emitirEstadisticasEstudiante,
} = require("../sockets/emitStats");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { console } = require("inspector");
const { getWelcomeTemplate } = require("../services/EmailServices/welcomeEmailService");

const createAdmin = async (req, res) => {
  try {
    const { documento_identidad, nombre, apellido, correo, id_institucion } =
      req.body;

    // Generar una contraseña aleatoria
    const contraseña = crypto.randomBytes(4).toString("hex");

    // Crear el administrador en la base de datos
    const newAdmin = await usuarioService.addUsuario(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      "admin",
      id_institucion
    );

    // Obtener los colores institucionales por defecto
    const institucion = await institucionService.getInstitucionById(
      id_institucion
    );
    let {
      logo,
      nombre: nombreInstitucion,
      color_principal,
      color_pildora1,
      color_pildora2,
    } = institucion;

    // Usar el logo predeterminado de PRAE si no se proporciona uno
    if (!logo) {
      logo =
        "https://firebasestorage.googleapis.com/v0/b/praeweb-a1526.firebasestorage.app/o/logos%2FLOGO_SOMBRERO.svg?alt=media&token=d2e2d361-8a9f-45e0-857d-2e7408c9422d";
    }

    // Obtener HTML de plantilla con correo y contraseña reemplazados
    const emailContent = await getWelcomeTemplate(
      correo,
      contraseña,
      color_principal,
      color_pildora1,
      color_pildora2,
      nombreInstitucion 
    );

    await emailService.sendEmail(
      correo,
      "Bienvenido a PRAE - Credenciales de acceso",
      emailContent
    );

    res.status(201).json({
      message: "Administrador creado exitosamente",
      admin: newAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createProfesor = async (req, res) => {
  try {
    const {
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza,
    } = req.body;

    // Crear el profesor en la base de datos
    const newProfesor = await usuarioService.addProfesor(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza
    );

    // Emitir estadísticas actualizadas para la institución
    await emitirEstadisticasInstitucion(id_institucion);

    // Obtener los datos de la institución
    const institucion = await institucionService.getInstitucionById(
      id_institucion
    );
    let {
      logo,
      nombre: nombreInstitucion,
      color_principal,
      color_pildora1,
      color_pildora2,
    } = institucion;

    // Usar el logo predeterminado de PRAE si no se proporciona uno
    if (!logo) {
      logo =
        "https://firebasestorage.googleapis.com/v0/b/praeweb-a1526.firebasestorage.app/o/logos%2FLOGO_SOMBRERO.svg?alt=media&token=d2e2d361-8a9f-45e0-857d-2e7408c9422d";
    }

    // Obtener HTML de plantilla con correo y contraseña reemplazados (tutorial)
    const emailContent = await getWelcomeTemplate(
      correo,
      contraseña,
      color_principal,
      color_pildora1,
      color_pildora2,
      nombreInstitucion
    );

    await emailService.sendEmail(
      correo,
      "Bienvenido a PRAE - Credenciales de acceso",
      emailContent
    );

    res.status(201).json({
      message: "Profesor creado exitosamente",
      profesor: newProfesor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createEstudiante = async (req, res) => {
  try {
    const {
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      id_curso,
    } = req.body;

    // Crear el estudiante
    const newEstudiante = await usuarioService.addEstudiante(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      id_curso
    );

    // Emitir estadísticas actualizadas para la institución
    await emitirEstadisticasInstitucion(id_institucion);

    // Obtener el logo de la institución
    const institucion = await institucionService.getInstitucionById(
      id_institucion
    );
    const {
      logo: logoInstitucion,
      nombre: nombreInstitucion,
      color_principal,
      color_pildora1,
      color_pildora2,
    } = institucion;

    const logo =
      logoInstitucion ||
      "https://firebasestorage.googleapis.com/v0/b/praeweb-a1526.firebasestorage.app/o/logos%2FLOGO_SOMBRERO.svg?alt=media&token=d2e2d361-8a9f-45e0-857d-2e7408c9422d";

    // Obtener el nombre del curso
    const curso = await cursoService.getCursoById(id_curso);


    // Obtener HTML de plantilla con correo y contraseña reemplazados (tutorial)
    const emailContent = await getWelcomeTemplate(
      correo,
      contraseña,
      color_principal,
      color_pildora1,
      color_pildora2,
      nombreInstitucion,
    );

    await emailService.sendEmail(
      correo,
      "Bienvenido a PRAE - Credenciales de acceso",
      emailContent
    );

    res.status(201).json({
      message: "Estudiante creado exitosamente",
      estudiante: newEstudiante,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, rol, id_institucion, contraseña } =
      req.body;
    const updatedUser = await usuarioService.updateUsuario(
      id,
      nombre,
      apellido,
      correo,
      contraseña,
      rol,
      id_institucion
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor: " + error.message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamar al servicio para desactivar el usuario
    const usuarioEliminado = await usuarioService.deleteUsuario(id);

    // Verificar si el usuario fue encontrado
    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Emitir estadísticas actualizadas para la institución
    const id_institucion = usuarioEliminado.id_institucion;
    await emitirEstadisticasInstitucion(id_institucion);

    res.status(200).send("Usuario desactivado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor: " + error.message });
  }
};

const activarUsuario = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const usuarioActivado = await usuarioService.activarUsuario(
      documento_identidad
    );

    // Emitir estadísticas actualizadas para la institución
    const id_institucion = usuarioActivado.id_institucion; // Asegúrate de que el servicio devuelva el `id_institucion`
    await emitirEstadisticasInstitucion(id_institucion);

    res.status(200).json({
      message: "Usuario activado correctamente",
      usuario: usuarioActivado,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al activar el usuario: " + error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await usuarioService.getUsuariosByRol("admin");
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener administradores: " + error.message });
  }
};

const getDocentes = async (req, res) => {
  try {
    const docentes = await usuarioService.getUsuariosByRol("docente");
    res.status(200).json(docentes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener docentes: " + error.message });
  }
};

const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await usuarioService.getUsuariosByRol("estudiante");
    res.status(200).json(estudiantes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener estudiantes: " + error.message });
  }
};

// Obtener estudiantes por institución
const getEstudiantesPorInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const estudiantes = await usuarioService.getEstudiantesPorInstitucion(
      id_institucion
    );

    // Emitir estadísticas actualizadas para la institución
    await emitirEstadisticasInstitucion(id_institucion);

    res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error al obtener estudiantes por institución:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener estudiantes por profesor
const getEstudiantesPorProfesor = async (req, res) => {
  try {
    const { documento_profe } = req.params;
    const estudiantes = await usuarioService.getEstudiantesPorProfesor(
      documento_profe
    );
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error al obtener estudiantes por profesor:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener un profesor por su ID
const getProfesorById = async (req, res) => {
  try {
    const { documento_identidad } = req.params;

    // Verificar si el parámetro está definido
    if (!documento_identidad) {
      return res
        .status(400)
        .json({ error: "El documento de identidad es requerido" });
    }

    const profesor = await usuarioService.getProfesorById(documento_identidad);
    res.status(200).json(profesor);
  } catch (error) {
    console.error("Error al obtener el profesor:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener un estudiante por su ID
const getEstudianteById = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await usuarioService.getEstudianteById(id);
    res.status(200).json(estudiante);
  } catch (error) {
    console.error("Error al obtener el estudiante:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

//Actualizar admin
const updateAdmin = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const { nombre, apellido, correo, id_institucion, contraseña } = req.body;

    // Actualizar el administrador
    const adminActualizado = await usuarioService.updateAdmin(
      documento_identidad,
      nombre,
      apellido,
      correo,
      id_institucion,
      contraseña
    );

    // Obtener la información de la institución actualizada
    const institucion = {
      id_institucion: adminActualizado.id_institucion,
      nombre: adminActualizado.nombre_institucion,
      telefono: adminActualizado.telefono_institucion,
      instagram: adminActualizado.instagram_institucion,
      facebook: adminActualizado.facebook_institucion,
      logo: adminActualizado.logo_institucion,
      color_principal: adminActualizado.color_principal_institucion,
      color_secundario: adminActualizado.color_secundario_institucion,
      fondo: adminActualizado.fondo_institucion,
      color_pildora1: adminActualizado.color_pildora1_institucion,
      color_pildora2: adminActualizado.color_pildora2_institucion,
      color_pildora3: adminActualizado.color_pildora3_institucion,
      estado: adminActualizado.estado_institucion,
      direccion: adminActualizado.direccion_institucion,
    };

    // Crear el payload para el token
    const payload = {
      email: adminActualizado.correo,
      id: adminActualizado.documento_identidad,
      rol: adminActualizado.rol,
      nombre: adminActualizado.nombre,
      apellido: adminActualizado.apellido,
      institucion,
    };

    // Generar un nuevo token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Responder con el administrador actualizado y el nuevo token
    res.status(200).json({
      message: "Administrador actualizado con éxito",
      adminActualizado,
      token,
    });
  } catch (error) {
    console.error("Error al actualizar el administrador:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

// Actualizar datos de un profesor
const updateProfesor = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const {
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza,
    } = req.body;

    const usuarioActualizado = await usuarioService.updateProfesor(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza
    );

    res
      .status(200)
      .json({ message: "Profesor actualizado con éxito", usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar el profesor:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

// Actualizar datos de un estudiante
const updateEstudiante = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const { nombre, apellido, correo, contraseña, id_institucion, id_curso } =
      req.body;

    const usuarioActualizado = await usuarioService.updateEstudiante(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      id_curso
    );

    res.status(200).json({
      message: "Estudiante actualizado con éxito",
      usuarioActualizado,
    });

    await emitirEstadisticasEstudiante(documento_identidad); // Emitir estadísticas al estudiante después de actualizar
    await emitirEstadisticasInstitucion(id_institucion); // Emitir estadísticas a la institución después de actualizar
  } catch (error) {
    console.error("Error al actualizar el estudiante:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener docentes por institución
const getDocentesPorInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const docentes = await usuarioService.getDocentesPorInstitucion(
      id_institucion
    );

    // Emitir estadísticas actualizadas para la institución
    await emitirEstadisticasInstitucion(id_institucion);
    res.status(200).json(docentes);
  } catch (error) {
    console.error(
      `Error al obtener docentes en la institución "${req.params.id_institucion}":`,
      error
    );
    res
      .status(500)
      .json({
        error: `Error interno del servidor al obtener docentes en la institución "${req.params.id_institucion}": ${error.message}`,
      });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { nuevaContraseña } = req.body;

    // Validar que el campo requerido esté presente
    if (!nuevaContraseña) {
      return res.status(400).json({
        error: "Nueva contraseña requerida",
        detalle: "Por favor, proporciona la nueva contraseña para actualizarla",
      });
    }

    // Obtener el correo del token
    const correo = req.user.email;

    // Actualizar la contraseña del usuario
    const usuarioActualizado = await usuarioService.updatePassword(
      correo,
      nuevaContraseña
    );

    if (!usuarioActualizado) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        detalle: "No se encontró un usuario con el correo proporcionado",
      });
    }

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error.message);
    res.status(500).json({
      error: "Error al actualizar la contraseña",
      detalle: error.message,
    });
  }
};

module.exports = {
  createAdmin,
  createProfesor,
  createEstudiante,
  getUsuarios,
  updateUsuario,
  deleteUsuario,
  activarUsuario,
  getAdmins,
  getDocentes,
  getEstudiantes,
  updateEstudiante,
  updateAdmin,
  updateProfesor,
  getEstudiantesPorInstitucion,
  getEstudiantesPorProfesor,
  getEstudianteById,
  getProfesorById,
  getDocentesPorInstitucion,
  updatePassword,
};

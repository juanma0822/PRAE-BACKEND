const ComentarioService = require('../services/comentario.service');
const usuarioService = require('../services/usuario.service'); 
const emailService = require('../services/emailService'); 
const institucionService = require('../services/institucion.service');
const { emitirEstadisticasProfesor, emitirEstadisticasEstudiante } = require('../sockets/emitStats');
const { getObservacionTemplate } = require("../services/EmailServices/observacionEmailService");

// Crear un nuevo comentario
const createComentario = async (req, res) => {
  try {
    const { comentario, documento_profe, documento_estudiante } = req.body;

    // Crear el comentario
    const nuevoComentario = await ComentarioService.createComentario(comentario, documento_profe, documento_estudiante);

    // Obtener el correo del estudiante
    const estudiante = await usuarioService.getEstudianteById(documento_estudiante);
    const { correo, nombre } = estudiante;

    const institucion = await institucionService.getInstitucionById(estudiante.id_institucion);
    const nombreInstitucion = institucion.nombre;
    const logoInstitucion = institucion.logo;


    const emailContent = await getObservacionTemplate(
      correo,
      nombreInstitucion,
      nombre,
      logoInstitucion
    );


    // Enviar el correo al estudiante
    await emailService.sendEmail(
      correo,
      'Nueva observación recibida',
      emailContent
    );

    await emitirEstadisticasProfesor(documento_profe); // Emitir estadísticas al profesor después de crear el comentario

    await emitirEstadisticasEstudiante(documento_estudiante); // Emitir estadísticas al estudiante después de crear el comentario

    res.status(201).json(nuevoComentario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los comentarios
const getAllComentarios = async (req, res) => {
  try {
    const comentarios = await ComentarioService.getAllComentarios();
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios por profesor
const getComentariosPorProfesor = async (req, res) => {
  try {
    const { documento_profe } = req.params;
    const comentarios = await ComentarioService.getComentariosPorProfesor(documento_profe);
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios por estudiante
const getComentariosPorEstudiante = async (req, res) => {
  try {
    const { documento_estudiante } = req.params;
    const comentarios = await ComentarioService.getComentariosPorEstudiante(documento_estudiante);
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios por profesor y estudiante
const getComentariosPorProfesorYEstudiante = async (req, res) => {
  try {
    const { documento_profe, documento_estudiante } = req.params;
    const comentarios = await ComentarioService.getComentariosPorProfesorYEstudiante(documento_profe, documento_estudiante);
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un comentario 
const updateComentario = async (req, res) => {
  try {
    const { id } = req.params; // Cambiamos a id
    const { comentario } = req.body;

    const comentarioActualizado = await ComentarioService.updateComentario(id, comentario);

    res.status(200).json(comentarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un comentario
const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await ComentarioService.deleteComentario(id);

    // Emitir estadísticas si hay un profesor asociado
    if (resultado?.documento_profe) {
      await emitirEstadisticasProfesor(resultado.documento_profe);
    }
    await emitirEstadisticasEstudiante(resultado.documento_estudiante); // Emitir estadísticas al estudiante después de eliminar el comentario

    res.status(200).json({
      message: "Comentario eliminado correctamente",
      comentario: resultado
    });

  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ message: error.message || 'Error al eliminar comentario' });
  }
};


module.exports = {
  createComentario,
  getAllComentarios,
  getComentariosPorProfesor,
  getComentariosPorEstudiante,
  deleteComentario,
  getComentariosPorProfesorYEstudiante,
  updateComentario,
};
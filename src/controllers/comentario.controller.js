const ComentarioService = require('../services/comentario.service');
const usuarioService = require('../services/usuario.service'); 
const emailService = require('../services/emailService'); 

// Crear un nuevo comentario
const createComentario = async (req, res) => {
  try {
    const { comentario, documento_profe, documento_estudiante } = req.body;

    // Crear el comentario
    const nuevoComentario = await ComentarioService.createComentario(comentario, documento_profe, documento_estudiante);

    // Obtener el correo del estudiante
    const estudiante = await usuarioService.getEstudianteById(documento_estudiante);
    const { correo, nombre } = estudiante;

    // Construir el contenido principal del correo
    const mainContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center; padding: 20px;">
        <h2 style="color: #157AFE;">¡Nueva observación recibida!</h2>
        <p>Hola ${nombre},</p>
        <p>Revisa tu apartado de observaciones. Un profesor te ha hecho una nueva observación.</p>
        <p>Estas observaciones te ayudan a mejorar tu proceso de aprendizaje y a seguir formándote constantemente.</p>
        <p>¡Sigue esforzándote y creciendo!</p>
      </div>
    `;

    // Generar el correo completo usando la plantilla genérica sin footer
    const emailContent = emailService.generateEmailTemplate(mainContent, '');

    // Enviar el correo al estudiante
    await emailService.sendEmail(
      correo,
      'Nueva observación recibida',
      emailContent
    );

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
    const { id_comentario } = req.params;
    const resultado = await ComentarioService.deleteComentario(id_comentario);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
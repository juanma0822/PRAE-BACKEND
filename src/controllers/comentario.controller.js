const comentarioService = require('../services/comentario.service');

// Crear un nuevo comentario
const createComentario = async (req, res) => {
  try {
    const { comentario, documento_profe, documento_estudiante } = req.body;
    const nuevoComentario = await comentarioService.createComentario(comentario, documento_profe, documento_estudiante);
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los comentarios
const getAllComentarios = async (req, res) => {
  try {
    const comentarios = await comentarioService.getAllComentarios();
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios por profesor
const getComentariosPorProfesor = async (req, res) => {
  try {
    const { documento_profe } = req.params;
    const comentarios = await comentarioService.getComentariosPorProfesor(documento_profe);
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios por estudiante
const getComentariosPorEstudiante = async (req, res) => {
  try {
    const { documento_estudiante } = req.params;
    const comentarios = await comentarioService.getComentariosPorEstudiante(documento_estudiante);
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un comentario
const deleteComentario = async (req, res) => {
  try {
    const { id_comentario } = req.params;
    const resultado = await comentarioService.deleteComentario(id_comentario);
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
};
const ComentarioModel = require('../models/comentario.modelo');

const ComentarioService = {
  // Crear un nuevo comentario
  async createComentario(comentario, documento_profe, documento_estudiante) {
    return await ComentarioModel.insertComentario(comentario, documento_profe, documento_estudiante);
  },

  // Obtener todos los comentarios
  async getAllComentarios() {
    return await ComentarioModel.getAllComentarios();
  },

  // Obtener comentarios por profesor
  async getComentariosPorProfesor(documento_profe) {
    return await ComentarioModel.getComentariosPorProfesor(documento_profe);
  },

  // Obtener comentarios por estudiante
  async getComentariosPorEstudiante(documento_estudiante) {
    return await ComentarioModel.getComentariosPorEstudiante(documento_estudiante);
  },

  // Obtener comentarios por profesor y estudiante
  async getComentariosPorProfesorYEstudiante(documento_profe, documento_estudiante) {
    return await ComentarioModel.getComentariosPorProfesorYEstudiante(documento_profe, documento_estudiante);
  },

  // Eliminar un comentario
  async deleteComentario(id_comentario) {
    return await ComentarioModel.deleteComentario(id_comentario);
  },
};

module.exports = ComentarioService;
const { consultarDB } = require('../db'); // Importa la función para consultar la base de datos

const ComentarioModel = {
  // Insertar un nuevo comentario
  async insertComentario(comentario, documento_profe, documento_estudiante) {
    const query = `
      INSERT INTO Comentarios (comentario, documento_profe, documento_estudiante)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [comentario, documento_profe, documento_estudiante];
    const result = await consultarDB(query, values);
    return result[0];
  },

  // Obtener todos los comentarios
  async getAllComentarios() {
    const query = 'SELECT * FROM Comentarios';
    const result = await consultarDB(query);
    return result;
  },

  // Obtener comentarios por profesor
  async getComentariosPorProfesor(documento_profe) {
    const query = 'SELECT * FROM Comentarios WHERE documento_profe = $1';
    const result = await consultarDB(query, [documento_profe]);
    return result;
  },

  // Obtener comentarios por estudiante
  async getComentariosPorEstudiante(documento_estudiante) {
    const query = 'SELECT * FROM Comentarios WHERE documento_estudiante = $1';
    const result = await consultarDB(query, [documento_estudiante]);
    return result;
  },

  // Obtener comentarios por profesor y estudiante
  async getComentariosPorProfesorYEstudiante(documento_profe, documento_estudiante) {
    const query = 'SELECT * FROM Comentarios WHERE documento_profe = $1 AND documento_estudiante = $2';
    const result = await consultarDB(query, [documento_profe, documento_estudiante]);
    return result;
  },

  // Eliminar un comentario
  async deleteComentario(id_comentario) {
    const query = 'DELETE FROM Comentarios WHERE id_comentario = $1 RETURNING *';
    const result = await consultarDB(query, [id_comentario]);
    return result[0];
  },
};

module.exports = ComentarioModel;
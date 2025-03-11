const { consultarDB } = require('../db');

// Insertar un nuevo historial de grado
const insertHistorialGrado = async (id_estudiante, id_curso, id_periodo, anio) => {
  const query = `
    INSERT INTO HistorialGrado (id_estudiante, id_curso, id_periodo, anio, estado)
    VALUES ($1, $2, $3, $4, TRUE)
    RETURNING *;
  `;
  const values = [id_estudiante, id_curso, id_periodo, anio];
  const result = await consultarDB(query, values);
  return result[0];
};

// Obtener todos los historiales de grado activos
const getAllHistorialesGrado = async () => {
  const query = `
    SELECT * FROM HistorialGrado
    WHERE estado = TRUE;
  `;
  const result = await consultarDB(query);
  return result;
};

// Obtener el historial de grado de un estudiante por año
const getHistorialGradoByEstudianteAnio = async (id_estudiante, anio) => {
  const query = `
    SELECT hg.*, m.nombre AS nombre_materia
    FROM HistorialGrado hg
    JOIN Asignar a ON hg.id_curso = a.id_curso
    JOIN Materia m ON a.id_materia = m.id_materia
    WHERE hg.id_estudiante = $1 AND hg.anio = $2 AND hg.estado = TRUE;
  `;
  const result = await consultarDB(query, [id_estudiante, anio]);
  return result;
};

// Obtener todos los historiales de grado de una institución específica
const getHistorialesGradoByInstitucion = async (id_institucion) => {
  const query = `
    SELECT hg.*
    FROM HistorialGrado hg
    JOIN Curso c ON hg.id_curso = c.id_curso
    WHERE c.id_institucion = $1 AND hg.estado = TRUE;
  `;
  const result = await consultarDB(query, [id_institucion]);
  return result;
};

// Obtener el historial completo de un estudiante
const getHistorialCompletoByEstudiante = async (id_estudiante) => {
    const query = `
      SELECT hg.*, m.nombre AS nombre_materia
      FROM HistorialGrado hg
      JOIN Asignar a ON hg.id_curso = a.id_curso
      JOIN Materia m ON a.id_materia = m.id_materia
      WHERE hg.id_estudiante = $1;
    `;
    const result = await consultarDB(query, [id_estudiante]);
    return result;
  };

// Actualizar un historial de grado
const updateHistorialGrado = async (id_historial, id_estudiante, id_curso, id_periodo, anio) => {
  const query = `
    UPDATE HistorialGrado
    SET id_estudiante = $1, id_curso = $2, id_periodo = $3, anio = $4
    WHERE id_historial = $5 AND estado = TRUE
    RETURNING *;
  `;
  const values = [id_estudiante, id_curso, id_periodo, anio, id_historial];
  const result = await consultarDB(query, values);
  return result[0];
};

// Desactivar un historial de grado (cambiar estado a false)
const deleteHistorialGrado = async (id_historial) => {
  const query = `
    UPDATE HistorialGrado
    SET estado = FALSE
    WHERE id_historial = $1
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_historial]);
  return result[0];
};

module.exports = {
  insertHistorialGrado,
  getAllHistorialesGrado,
  getHistorialGradoByEstudianteAnio,
  getHistorialesGradoByInstitucion,
  getHistorialCompletoByEstudiante,
  updateHistorialGrado,
  deleteHistorialGrado,
};
const { consultarDB } = require('../db');

// Insertar una relación Dictar
const insertDictar = async (documento_profe, id_materia) => {
  // Verificar si ya existe una relación activa
  const checkQuery = `
    SELECT * FROM Dictar 
    WHERE documento_profe = $1 AND id_materia = $2 AND estado = TRUE;
  `;
  const checkResult = await consultarDB(checkQuery, [documento_profe, id_materia]);
  if (checkResult.length > 0) {
    throw new Error('La relación Dictar ya existe');
  }

  const query = `
    INSERT INTO Dictar (documento_profe, id_materia, estado)
    VALUES ($1, $2, TRUE)
    RETURNING *;
  `;
  const values = [documento_profe, id_materia];
  const result = await consultarDB(query, values);
  return result[0];
};

// Obtener todas las relaciones Dictar con detalles adicionales
const getAllDictar = async () => {
  const query = `
    SELECT 
      d.id_materiadictada,
      u.nombre AS nombre_profesor,
      u.apellido AS apellido_profesor,
      m.nombre AS nombre_materia,
      c.nombre AS nombre_curso
    FROM Dictar d
    JOIN Profesor p ON d.documento_profe = p.documento_identidad
    JOIN Usuario u ON p.documento_identidad = u.documento_identidad
    JOIN Materia m ON d.id_materia = m.id_materia
    JOIN Asignar a ON m.id_materia = a.id_materia
    JOIN Curso c ON a.id_curso = c.id_curso
    WHERE m.activo = TRUE AND c.activo = TRUE AND d.estado = TRUE;
  `;
  const result = await consultarDB(query);
  return result;
};

// Obtener las materias que dicta un profesor
const getMateriasPorProfesor = async (documento_profe) => {
  const query = `
    SELECT 
      m.id_materia,
      m.nombre AS nombre_materia,
      c.id_curso,
      c.nombre AS nombre_curso
    FROM Dictar d
    JOIN Materia m ON d.id_materia = m.id_materia
    JOIN Asignar a ON m.id_materia = a.id_materia
    JOIN Curso c ON a.id_curso = c.id_curso
    WHERE d.documento_profe = $1 AND m.activo = TRUE AND c.activo = TRUE AND d.estado = TRUE;
  `;
  const result = await consultarDB(query, [documento_profe]);
  return result;
};

// Obtener los profesores que dictan una materia
const getProfesoresPorMateria = async (id_materia) => {
  const query = `
    SELECT p.* 
    FROM Dictar d
    JOIN Profesor p ON d.documento_profe = p.documento_identidad
    WHERE d.id_materia = $1 AND d.estado = TRUE;
  `;
  const result = await consultarDB(query, [id_materia]);
  return result;
};

// Eliminar una relación Dictar (cambiar estado a false)
const deleteDictar = async (documento_profe, id_materia) => {
  const query = `
    UPDATE Dictar
    SET estado = FALSE
    WHERE documento_profe = $1 AND id_materia = $2
    RETURNING *;
  `;
  const result = await consultarDB(query, [documento_profe, id_materia]);
  return result[0];
};

// Actualizar materia que da un profesor
const updateMateriaProfesor = async (documento_identidad, id_materia) => {
  const query = `
    UPDATE Dictar 
    SET id_materia = $1 
    WHERE documento_profe = $2 AND estado = TRUE
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_materia, documento_identidad]);
  return result[0];
};

module.exports = {
  insertDictar,
  getAllDictar,
  getMateriasPorProfesor,
  getProfesoresPorMateria,
  deleteDictar,
  updateMateriaProfesor
};
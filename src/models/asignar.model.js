const { consultarDB } = require("../db");

const asignarMateria = async (id_curso, id_materia, id_docente) => {
  // Verificar si ya existe la asignación
  const queryVerificar = `
    SELECT 
      a.id_asignacion,
      c.nombre AS curso_nombre,
      m.nombre AS materia_nombre,
      u.nombre AS docente_nombre,
      u.apellido AS docente_apellido
    FROM Asignar a
    INNER JOIN Curso c ON a.id_curso = c.id_curso
    INNER JOIN Materia m ON a.id_materia = m.id_materia
    LEFT JOIN Profesor p ON a.id_docente = p.documento_identidad
    LEFT JOIN Usuario u ON p.documento_identidad = u.documento_identidad
    WHERE a.id_curso = $1 AND a.id_materia = $2 AND a.id_docente = $3 AND a.estado = TRUE;
  `;
  const asignacionExistente = await consultarDB(queryVerificar, [id_curso, id_materia, id_docente]);

  if (asignacionExistente.length > 0) {
    const asignacion = asignacionExistente[0];
    throw new Error(
      `La materia "${asignacion.materia_nombre}" ya está asignada al curso "${asignacion.curso_nombre}" con el docente "${asignacion.docente_nombre} ${asignacion.docente_apellido}".`
    );
  }

  // Si no existe, crear la asignación
  const queryInsertar = `
    INSERT INTO Asignar (id_curso, id_materia, id_docente)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await consultarDB(queryInsertar, [id_curso, id_materia, id_docente]);
  return result[0];
};

const obtenerMateriasPorCurso = async (id_curso) => {
  const query = `
    SELECT 
      m.id_materia, 
      m.nombre AS materia,
      m.color, 
      u.documento_identidad, 
      u.nombre AS profesor_nombre, 
      u.apellido AS profesor_apellido
    FROM Asignar a
    INNER JOIN Materia m ON a.id_materia = m.id_materia
    LEFT JOIN Profesor p ON a.id_docente = p.documento_identidad
    LEFT JOIN Usuario u ON p.documento_identidad = u.documento_identidad
    WHERE a.id_curso = $1;
  `;
  const result = await consultarDB(query, [id_curso]);
  return result;
};

const eliminarAsignacion = async (id_asignacion) => {
  const query = `
    UPDATE Asignar
    SET estado = FALSE
    WHERE id_asignacion = $1
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_asignacion]);
  return result[0];
};

const obtenerAsignacionesPorInstitucion = async (id_institucion) => {
  const query = `
    SELECT 
      a.id_asignacion,
      c.id_curso, 
      c.nombre AS curso,
      m.id_materia,
      m.color, 
      m.nombre AS materia, 
      u.documento_identidad AS profesor_documento, 
      u.nombre AS profesor_nombre, 
      u.apellido AS profesor_apellido
    FROM Asignar a
    INNER JOIN Curso c ON a.id_curso = c.id_curso
    INNER JOIN Materia m ON a.id_materia = m.id_materia
    LEFT JOIN Profesor p ON a.id_docente = p.documento_identidad
    LEFT JOIN Usuario u ON p.documento_identidad = u.documento_identidad
    WHERE c.id_institucion = $1 AND a.estado = TRUE;
  `;

  const result = await consultarDB(query, [id_institucion]);
  return result;
};

const obtenerMateriasPorGrado = async (id_curso, id_institucion) => {
  const query = `
    SELECT 
      m.id_materia, 
      m.nombre AS materia,
      m.color, 
      u.documento_identidad AS profesor_documento, 
      u.nombre AS profesor_nombre, 
      u.apellido AS profesor_apellido
    FROM Asignar a
    INNER JOIN Materia m ON a.id_materia = m.id_materia
    INNER JOIN Curso c ON a.id_curso = c.id_curso
    LEFT JOIN Profesor p ON a.id_docente = p.documento_identidad
    LEFT JOIN Usuario u ON p.documento_identidad = u.documento_identidad
    WHERE a.id_curso = $1 AND c.id_institucion = $2;
  `;
  const result = await consultarDB(query, [id_curso, id_institucion]);
  return result;
};

const obtenerGradosPorProfesor = async (documento_profe) => {
  const query = `
    SELECT DISTINCT 
      c.id_curso, 
      c.nombre AS curso,
      c.color, 
      u.documento_identidad AS profesor_documento, 
      u.nombre AS profesor_nombre, 
      u.apellido AS profesor_apellido
    FROM Dictar d
    INNER JOIN Asignar a ON d.id_materia = a.id_materia
    INNER JOIN Curso c ON a.id_curso = c.id_curso
    INNER JOIN Profesor p ON d.documento_profe = p.documento_identidad
    INNER JOIN Usuario u ON p.documento_identidad = u.documento_identidad
    WHERE d.documento_profe = $1;
  `;
  const result = await consultarDB(query, [documento_profe]);
  return result;
};

const obtenerAsignacionesPorProfesor = async (documento_profe) => {
  const query = `
    SELECT DISTINCT 
      a.id_asignacion,
      c.id_curso,
      c.nombre AS curso,
      m.id_materia,
      m.nombre AS materia,
      m.color,
      u.documento_identidad AS profesor_documento,
      u.nombre AS profesor_nombre,
      u.apellido AS profesor_apellido
    FROM Dictar d
    INNER JOIN Materia m ON d.id_materia = m.id_materia
    INNER JOIN Asignar a ON m.id_materia = a.id_materia
    INNER JOIN Curso c ON a.id_curso = c.id_curso
    INNER JOIN Profesor p ON d.documento_profe = p.documento_identidad
    INNER JOIN Usuario u ON p.documento_identidad = u.documento_identidad
    WHERE d.documento_profe = $1 AND a.estado = TRUE;
  `;
  const result = await consultarDB(query, [documento_profe]);
  return result;
};

module.exports = {
  asignarMateria,
  obtenerMateriasPorCurso,
  eliminarAsignacion,
  obtenerAsignacionesPorInstitucion,
  obtenerMateriasPorGrado,
  obtenerGradosPorProfesor,
  obtenerAsignacionesPorProfesor,
};

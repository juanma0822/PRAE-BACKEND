const { consultarDB } = require("../db");

const asignarMateria = async (id_curso, id_materia, id_docente) => {
  const query = `
    INSERT INTO Asignar (id_curso, id_materia, id_docente)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_curso, id_materia, id_docente]);
  return result[0];
};

const obtenerMateriasPorCurso = async (id_curso) => {
    const query = `
      SELECT 
        m.id_materia, 
        m.nombre AS materia, 
        p.documento_identidad, 
        p.nombre AS profesor_nombre, 
        p.apellido AS profesor_apellido
      FROM Asignar a
      INNER JOIN Materia m ON a.id_materia = m.id_materia
      LEFT JOIN Dictar d ON m.id_materia = d.id_materia
      LEFT JOIN Profesor p ON d.documento_profe = p.documento_identidad
      WHERE a.id_curso = $1;
    `;
    const result = await consultarDB(query, [id_curso]);
    return result;
  };

const eliminarAsignacion = async (id_asignacion) => {
  const query = `
        DELETE FROM Asignar WHERE id_asignacion = $1
        RETURNING *;
    `;
  const result = await consultarDB(query, [id_asignacion]);
  return result[0];
};

const obtenerAsignacionesPorInstitucion = async (id_institucion) => {
    const query = `
        SELECT a.id_asignacion, c.nombre AS curso, m.nombre AS materia
        FROM Asignar a
        INNER JOIN Curso c ON a.id_curso = c.id_curso
        INNER JOIN Materia m ON a.id_materia = m.id_materia
        WHERE c.id_institucion = $1;
      `;
    const result = await consultarDB(query, [id_institucion]);
    return result;
  };

  const obtenerMateriasPorGrado = async (id_curso, id_institucion) => {
    const query = `
      SELECT 
        m.id_materia, 
        m.nombre AS materia, 
        p.documento_identidad, 
        p.nombre AS profesor_nombre, 
        p.apellido AS profesor_apellido
      FROM Asignar a
      INNER JOIN Materia m ON a.id_materia = m.id_materia
      INNER JOIN Curso c ON a.id_curso = c.id_curso
      LEFT JOIN Dictar d ON m.id_materia = d.id_materia
      LEFT JOIN Profesor p ON d.documento_profe = p.documento_identidad
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
        p.documento_identidad, 
        p.nombre AS profesor_nombre, 
        p.apellido AS profesor_apellido
      FROM Dictar d
      INNER JOIN Asignar a ON d.id_materia = a.id_materia
      INNER JOIN Curso c ON a.id_curso = c.id_curso
      INNER JOIN Profesor p ON d.documento_profe = p.documento_identidad
      WHERE d.documento_profe = $1;
    `;
    const result = await consultarDB(query, [documento_profe]);
    return result;
  };

  const obtenerAsignacionesPorProfesor = async (documento_profe) => {
    const query = `
      SELECT 
        a.id_asignacion,
        c.id_curso,
        c.nombre AS curso,
        m.id_materia,
        m.nombre AS materia,
        p.documento_identidad AS profesor_documento,
        p.nombre AS profesor_nombre,
        p.apellido AS profesor_apellido
      FROM Dictar d
      INNER JOIN Materia m ON d.id_materia = m.id_materia
      INNER JOIN Asignar a ON m.id_materia = a.id_materia
      INNER JOIN Curso c ON a.id_curso = c.id_curso
      INNER JOIN Profesor p ON d.documento_profe = p.documento_identidad
      WHERE d.documento_profe = $1;
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

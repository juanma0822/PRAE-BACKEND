const pool = require('../db');

const getCursos = async () => {
    const query = `SELECT * FROM Curso WHERE activo = TRUE;`;
    const result = await pool.query(query);
    return result.rows;
};

const getCursoById = async (id) => {
    const query = `SELECT * FROM Curso WHERE id_curso = $1 AND activo = TRUE;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const createCurso = async (nombre, institucion) => {
    const query = `INSERT INTO Curso (nombre, institucion) VALUES ($1, $2) RETURNING *;`;
    const result = await pool.query(query, [nombre, institucion]);
    return result.rows[0];
};

const updateCurso = async (id, nombre, institucion) => {
    const query = `UPDATE Curso SET nombre = $1, institucion = $2 WHERE id_curso = $3 AND activo = TRUE RETURNING *;`;
    const result = await pool.query(query, [nombre, institucion, id]);
    return result.rowCount > 0;
};

const deleteCurso = async (id) => {
    const query = `UPDATE Curso SET activo = FALSE WHERE id_curso = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
};

const activateCurso = async (id) => {
    const query = `UPDATE Curso SET activo = TRUE WHERE id_curso = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
};

// Buscar curso por nombre
const findCursoByName = async (nombre) => {
    const result = await pool.query('SELECT id_curso FROM Curso WHERE nombre = $1', [nombre]);
    return result.rows[0]; 
};

// Obtener estudiantes por curso
const obtenerEstudiantesPorCurso = async (id_curso) => {
    const query = `
    SELECT 
    usuario.documento_identidad, 
    usuario.nombre, 
    usuario.apellido, 
    usuario.correo, 
    estudiante.id_curso
    FROM Estudiante AS estudiante
    JOIN Usuario AS usuario ON estudiante.documento_identidad = usuario.documento_identidad
    WHERE estudiante.id_curso = $1 AND usuario.activo = TRUE;
    `;
  
    const { rows } = await pool.query(query, [id_curso]);
    return rows;
};

// Obtener todos los cursos de una institución específica
const getCursosByInstitucion = async (institucion) => {
    const query = `SELECT * FROM Curso WHERE institucion = $1 AND activo = TRUE;`;
    const result = await pool.query(query, [institucion]);
    return result.rows;
};

module.exports = {
    getCursos,
    getCursoById,
    createCurso,
    updateCurso,
    deleteCurso,
    activateCurso,
    findCursoByName,
    obtenerEstudiantesPorCurso,
    getCursosByInstitucion,
};
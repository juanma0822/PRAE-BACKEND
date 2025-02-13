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

const createCurso = async (nombre) => {
    const query = `INSERT INTO Curso (nombre) VALUES ($1) RETURNING *;`;
    const result = await pool.query(query, [nombre]);
    return result.rows[0];
};

const updateCurso = async (id, nombre) => {
    const query = `UPDATE Curso SET nombre = $1 WHERE id_curso = $2 AND activo = TRUE RETURNING *;`;
    const result = await pool.query(query, [nombre, id]);
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

const obtenerEstudiantesPorCurso = async (id_curso) => {
// Consulta SQL para obtener los estudiantes de un curso dado su id_curso
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

module.exports = {
    getCursos,
    getCursoById,
    createCurso,
    updateCurso,
    deleteCurso,
    activateCurso,
    findCursoByName,
    obtenerEstudiantesPorCurso,
};

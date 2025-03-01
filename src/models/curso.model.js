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
    // Verificar si ya existe un curso con el mismo nombre en la misma institución
    const checkQuery = `SELECT * FROM Curso WHERE nombre = $1 AND institucion = $2 AND activo = TRUE;`;
    const checkResult = await pool.query(checkQuery, [nombre, institucion]);
    if (checkResult.rows.length > 0) {
        throw new Error(`Ya existe un curso con el nombre "${nombre}" en la institución "${institucion}"`);
    }

    // Asignar un color aleatorio si no se proporciona uno
    const colores = ['azul', 'amarillo', 'morado'];
    const colorAsignado = colores[Math.floor(Math.random() * colores.length)];

    // Insertar el nuevo curso
    const query = `INSERT INTO Curso (nombre, institucion, color) VALUES ($1, $2, $3) RETURNING *;`;
    const result = await pool.query(query, [nombre, institucion, colorAsignado]);
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
const { consultarDB } = require('../db');

const getCursos = async () => {
    const query = `SELECT * FROM Curso WHERE activo = TRUE;`;
    const result = await consultarDB(query);
    return result;
};

const getCursoById = async (id) => {
    const query = `SELECT * FROM Curso WHERE id_curso = $1 AND activo = TRUE;`;
    const result = await consultarDB(query, [id]);
    return result[0];
};

const createCurso = async (nombre, id_institucion) => {
    // Verificar si ya existe un curso con el mismo nombre en la misma institución
    const checkQuery = `SELECT * FROM Curso WHERE nombre = $1 AND id_institucion = $2 AND activo = TRUE;`;
    const checkResult = await consultarDB(checkQuery, [nombre, id_institucion]);
    if (checkResult.length > 0) {
        throw new Error(`Ya existe un curso con el nombre "${nombre}" en la institución con ID "${id_institucion}"`);
    }

    // Asignar un color aleatorio si no se proporciona uno
    const colores = ['azul', 'amarillo', 'morado'];
    const colorAsignado = colores[Math.floor(Math.random() * colores.length)];

    // Insertar el nuevo curso
    const query = `INSERT INTO Curso (nombre, id_institucion, color) VALUES ($1, $2, $3) RETURNING *;`;
    const result = await consultarDB(query, [nombre, id_institucion, colorAsignado]);
    return result[0];
};

const updateCurso = async (id, nombre, id_institucion) => {
    const query = `UPDATE Curso SET nombre = $1, id_institucion = $2 WHERE id_curso = $3 AND activo = TRUE RETURNING *;`;
    const result = await consultarDB(query, [nombre, id_institucion, id]);
    return result;
};

const deleteCurso = async (id) => {
    const query = `UPDATE Curso SET activo = FALSE WHERE id_curso = $1 RETURNING *;`;
    const result = await consultarDB(query, [id]);
    return result;
};

const activateCurso = async (id) => {
    const query = `UPDATE Curso SET activo = TRUE WHERE id_curso = $1 RETURNING *;`;
    const result = await consultarDB(query, [id]);
    return result;
};

const findCursoByName = async (nombre) => {
    const result = await consultarDB('SELECT id_curso FROM Curso WHERE nombre = $1', [nombre]);
    return result[0];
};

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
    const result = await consultarDB(query, [id_curso]);
    return result;
};

const getCursosByInstitucion = async (id_institucion) => {
    const query = `SELECT * FROM Curso WHERE id_institucion = $1 AND activo = TRUE;`;
    const result = await consultarDB(query, [id_institucion]);
    return result;
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
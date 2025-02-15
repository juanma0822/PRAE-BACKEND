const pool = require('../db');

const insertCalificacion = async (id_actividad, id_estudiante, nota) => {
    const query = `
        INSERT INTO Calificacion (id_actividad, id_estudiante, nota) 
        VALUES ($1, $2, $3) RETURNING *`;
    const values = [id_actividad, id_estudiante, nota];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const updateCalificacion = async (id_calificacion, nota) => {
    const query = `
        UPDATE Calificacion 
        SET nota = $1 
        WHERE id_calificacion = $2 RETURNING *`;
    const values = [nota, id_calificacion];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const selectCalificacionesEstudiante = async (id_materia, id_estudiante) => {
    const query = `
        SELECT c.id_calificacion, c.nota, a.nombre AS actividad
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        WHERE a.id_materia = $1 AND c.id_estudiante = $2`;
    const { rows } = await pool.query(query, [id_materia, id_estudiante]);
    return rows;
};

const selectCalificacionesCurso = async (id_materia, id_curso) => {
    const query = `
        SELECT e.documento_identidad, u.nombre, c.nota, a.nombre AS actividad
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        JOIN Estudiante e ON c.id_estudiante = e.documento_identidad
        JOIN Usuario u ON e.documento_identidad = u.documento_identidad
        WHERE a.id_materia = $1 AND e.id_curso = $2`;
    const { rows } = await pool.query(query, [id_materia, id_curso]);
    return rows;
};

const selectPromedioEstudiante = async (id_materia, id_estudiante) => {
    const query = `
        SELECT AVG(nota) AS promedio
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        WHERE a.id_materia = $1 AND c.id_estudiante = $2`;
    const { rows } = await pool.query(query, [id_materia, id_estudiante]);
    return rows[0].promedio;
};

module.exports = {
    insertCalificacion,
    updateCalificacion,
    selectCalificacionesEstudiante,
    selectCalificacionesCurso,
    selectPromedioEstudiante
};

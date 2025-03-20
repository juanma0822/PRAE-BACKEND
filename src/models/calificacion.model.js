const { consultarDB } = require('../db');

const insertCalificacion = async (id_actividad, id_estudiante, nota) => {
    const query = `
        INSERT INTO Calificacion (id_actividad, id_estudiante, nota) 
        VALUES ($1, $2, $3) RETURNING *`;
    const values = [id_actividad, id_estudiante, nota];
    const result = await consultarDB(query, values);
    return result[0];
};

const updateCalificacion = async (id_calificacion, nota) => {
    const query = `
        UPDATE Calificacion 
        SET nota = $1 
        WHERE id_calificacion = $2 RETURNING *`;
    const values = [nota, id_calificacion];
    const result = await consultarDB(query, values);
    return result[0];
};

const selectCalificacionesEstudiante = async (id_materia, id_estudiante) => {
    const query = `
        SELECT c.id_calificacion, c.nota, a.nombre AS actividad, c.id_actividad
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        WHERE a.id_materia = $1 AND c.id_estudiante = $2`;
    const result = await consultarDB(query, [id_materia, id_estudiante]);
    return result;
};

const selectCalificacionesEstudiantePorDocenteEInstitucion = async (id_materia, id_estudiante, id_docente, id_institucion) => {
    const query = `
        SELECT c.id_calificacion, c.nota, a.nombre AS actividad, a.peso, c.id_actividad
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        JOIN Materia m ON a.id_materia = m.id_materia
        WHERE a.id_materia = $1 
          AND c.id_estudiante = $2 
          AND a.id_docente = $3 
          AND m.id_institucion = $4;
    `;
    const result = await consultarDB(query, [id_materia, id_estudiante, id_docente, id_institucion]);
    return result;
};

const selectCalificacionesCurso = async (id_materia, id_curso) => {
    const query = `
        SELECT e.documento_identidad, u.nombre, u.apellido, c.nota, a.nombre AS actividad, c.id_actividad
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        JOIN Estudiante e ON c.id_estudiante = e.documento_identidad
        JOIN Usuario u ON e.documento_identidad = u.documento_identidad
        WHERE a.id_materia = $1 AND e.id_curso = $2`;
    const result = await consultarDB(query, [id_materia, id_curso]);

    // Agrupar las actividades por estudiante
    const groupedResult = result.reduce((acc, row) => {
        const { documento_identidad, nombre, apellido, nota, actividad } = row;
        if (!acc[documento_identidad]) {
            acc[documento_identidad] = {
                documento_identidad,
                nombre,
                apellido,
                actividades: []
            };
        }
        acc[documento_identidad].actividades.push({ nota, actividad });
        return acc;
    }, {});

    // Convertir el objeto groupedResult a un array
    return Object.values(groupedResult);
};

const selectPromedioEstudiante = async (id_materia, id_estudiante) => {
    const query = `
        SELECT AVG(nota) AS promedio
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        WHERE a.id_materia = $1 AND c.id_estudiante = $2`;
    const result = await consultarDB(query, [id_materia, id_estudiante]);
    return result[0].promedio;
};

module.exports = {
    insertCalificacion,
    updateCalificacion,
    selectCalificacionesEstudiante,
    selectCalificacionesEstudiantePorDocenteEInstitucion,
    selectCalificacionesCurso,
    selectPromedioEstudiante
};
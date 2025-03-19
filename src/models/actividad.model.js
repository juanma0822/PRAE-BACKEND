const { consultarDB } = require('../db');

const insertActividad = async (nombre, peso, id_materia, id_docente) => {
    const query = `
        INSERT INTO Actividades (nombre, peso, id_materia, id_docente) 
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [nombre, peso, id_materia, id_docente];
    const result = await consultarDB(query, values);
    return result[0];
};

const selectActividadesPorMateria = async (id_materia) => {
    const query = `
        SELECT a.*, u.nombre AS docente_nombre, u.apellido AS docente_apellido
        FROM Actividades a
        LEFT JOIN Usuario u ON a.id_docente = u.documento_identidad
        WHERE a.id_materia = $1`;
    const result = await consultarDB(query, [id_materia]);
    return result;
};

const updateActividad = async (id_actividad, nombre, peso, id_docente) => {
    const query = `
        UPDATE Actividades 
        SET nombre = $1, peso = $2, id_docente = $3
        WHERE id_actividad = $4 RETURNING *`;
    const values = [nombre, peso, id_docente, id_actividad];
    const result = await consultarDB(query, values);
    return result[0];
};

const deleteActividad = async (id_actividad) => {
    const query = `
        UPDATE Actividades
        SET activo = FALSE
        WHERE id_actividad = $1 RETURNING *`;
    const result = await consultarDB(query, [id_actividad]);
    return result[0];
};

module.exports = {
    insertActividad,
    selectActividadesPorMateria,
    updateActividad,
    deleteActividad
};
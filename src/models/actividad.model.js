const pool = require('../db');

const insertActividad = async (nombre, peso, id_materia) => {
    const query = `
        INSERT INTO Actividades (nombre, peso, id_materia) 
        VALUES ($1, $2, $3) RETURNING *`;
    const values = [nombre, peso, id_materia];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const selectActividadesPorMateria = async (id_materia) => {
    const query = `SELECT * FROM Actividades WHERE id_materia = $1`;
    const { rows } = await pool.query(query, [id_materia]);
    return rows;
};

const updateActividad = async (id_actividad, nombre, peso) => {
    const query = `
        UPDATE Actividades 
        SET nombre = $1, peso = $2 
        WHERE id_actividad = $3 RETURNING *`;
    const values = [nombre, peso, id_actividad];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const deleteActividad = async (id_actividad) => {
    const query = `DELETE FROM Actividades WHERE id_actividad = $1`;
    await pool.query(query, [id_actividad]);
};

module.exports = {
    insertActividad,
    selectActividadesPorMateria,
    updateActividad,
    deleteActividad
};

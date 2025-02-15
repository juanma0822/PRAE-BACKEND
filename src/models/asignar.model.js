const pool = require('../db');

const asignarMateria = async (id_curso, id_materia) => {
    const query = `
        INSERT INTO Asignar (id_curso, id_materia)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const result = await pool.query(query, [id_curso, id_materia]);
    return result.rows[0];
};

const obtenerMateriasPorCurso = async (id_curso) => {
    const query = `
        SELECT m.id_materia, m.nombre 
        FROM Asignar a
        INNER JOIN Materia m ON a.id_materia = m.id_materia
        WHERE a.id_curso = $1;
    `;
    const result = await pool.query(query, [id_curso]);
    return result.rows;
};

const eliminarAsignacion = async (id_asignacion) => {
    const query = `
        DELETE FROM Asignar WHERE id_asignacion = $1;
    `;
    await pool.query(query, [id_asignacion]);
};

module.exports = { asignarMateria, obtenerMateriasPorCurso, eliminarAsignacion };

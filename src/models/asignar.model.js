const { consultarDB } = require('../db');

const asignarMateria = async (id_curso, id_materia) => {
    const query = `
        INSERT INTO Asignar (id_curso, id_materia)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const result = await consultarDB(query, [id_curso, id_materia]);
    return result[0];
};

const obtenerMateriasPorCurso = async (id_curso) => {
    const query = `
        SELECT m.id_materia, m.nombre 
        FROM Asignar a
        INNER JOIN Materia m ON a.id_materia = m.id_materia
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

module.exports = { asignarMateria, obtenerMateriasPorCurso, eliminarAsignacion };
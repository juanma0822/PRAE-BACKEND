const { consultarDB, getClient } = require('../db');

const insertActividad = async (nombre, peso, id_materia, id_docente, id_curso) => {
    try {
      const query = `
        INSERT INTO Actividades (nombre, peso, id_materia, id_docente, id_curso) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const values = [nombre, peso, id_materia, id_docente, id_curso];
      const result = await consultarDB(query, values);
      return result[0];
    } catch (error) {
      throw new Error(`Error al insertar actividad: ${error.message}`);
    }
  };

const getActividadById = async (id_actividad) => {
    const query = `
        SELECT 
            a.id_actividad, 
            a.nombre AS nombre_actividad, 
            a.id_materia, 
            m.nombre AS nombre_materia,
            a.id_docente
        FROM Actividades a
        INNER JOIN Materia m ON a.id_materia = m.id_materia
        WHERE a.id_actividad = $1;
    `;
    const result = await consultarDB(query, [id_actividad]);
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

const selectActividadesPorMateriaDocenteInstitucion = async (id_institucion, id_docente, id_materia, id_curso) => {
    try {
      const query = `
        SELECT a.*, u.nombre AS docente_nombre, u.apellido AS docente_apellido
        FROM Actividades a
        INNER JOIN Materia m ON a.id_materia = m.id_materia
        INNER JOIN Usuario u ON a.id_docente = u.documento_identidad
        WHERE a.id_materia = $1 AND a.id_docente = $2 AND m.id_institucion = $3 AND a.id_curso = $4 AND a.activo = TRUE;
      `;
      const result = await consultarDB(query, [id_materia, id_docente, id_institucion, id_curso]);
      return result;
    } catch (error) {
      throw new Error(`Error al obtener actividades por materia, docente, institución y curso: ${error.message}`);
    }
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
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const resultActividad = await client.query(`
      UPDATE Actividades
      SET activo = FALSE
      WHERE id_actividad = $1
      RETURNING *;
    `, [id_actividad]);

    await client.query(`
      UPDATE Calificacion
      SET activo = FALSE
      WHERE id_actividad = $1;
    `, [id_actividad]);

    await client.query('COMMIT');
    return resultActividad.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error(`Error al eliminar la actividad y calificaciones: ${error.message}`);
  } finally {
    client.release();
  }
};

module.exports = {
    insertActividad,
    getActividadById,
    selectActividadesPorMateria,
    selectActividadesPorMateriaDocenteInstitucion,
    updateActividad,
    deleteActividad
};
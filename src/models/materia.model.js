const pool = require('../db');

// Insertar una materia
const insertMateria = async (nombre) => {
  const query = `
    INSERT INTO Materia (nombre, activo)
    VALUES ($1, TRUE)
    RETURNING *;
  `;
  const values = [nombre];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Obtener una materia por su ID
const getMateriaById = async (id_materia) => {
  const query = `
    SELECT * FROM Materia
    WHERE id_materia = $1 AND activo = TRUE;
  `;
  const result = await pool.query(query, [id_materia]);
  return result.rows[0];
};

// Obtener todas las materias activas
const getAllMaterias = async () => {
  const query = `
    SELECT * FROM Materia
    WHERE activo = TRUE;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Actualizar una materia
const updateMateria = async (id_materia, nombre) => {
  const query = `
    UPDATE Materia
    SET nombre = $1
    WHERE id_materia = $2 AND activo = TRUE
    RETURNING *;
  `;
  const values = [nombre, id_materia];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Desactivar una materia (cambiar estado activo a false)
const deleteMateria = async (id_materia) => {
  const query = `
    UPDATE Materia
    SET activo = FALSE
    WHERE id_materia = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id_materia]);
  return result.rows[0];
};

// Activar una materia (cambiar estado activo a true)
const activateMateria = async (id_materia) => {
  const query = `
    UPDATE Materia
    SET activo = TRUE
    WHERE id_materia = $1 AND activo = FALSE
    RETURNING *;
  `;
  const result = await pool.query(query, [id_materia]);
  return result.rows[0];
};

module.exports = {
  insertMateria,
  getMateriaById,
  getAllMaterias,
  updateMateria,
  deleteMateria,
  activateMateria,
};
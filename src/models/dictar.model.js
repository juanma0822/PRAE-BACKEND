const pool = require('../db');

// Insertar una relación Dictar
const insertDictar = async (documento_profe, id_materia) => {
  const query = `
    INSERT INTO Dictar (documento_profe, id_materia)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [documento_profe, id_materia];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Obtener todas las relaciones Dictar
const getAllDictar = async () => {
  const query = `
    SELECT * FROM Dictar;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Obtener las materias que dicta un profesor
const getMateriasPorProfesor = async (documento_profe) => {
  const query = `
    SELECT m.* 
    FROM Dictar d
    JOIN Materia m ON d.id_materia = m.id_materia
    WHERE d.documento_profe = $1 AND m.activo = TRUE;
  `;
  const result = await pool.query(query, [documento_profe]);
  return result.rows;
};

// Obtener los profesores que dictan una materia
const getProfesoresPorMateria = async (id_materia) => {
  const query = `
    SELECT p.* 
    FROM Dictar d
    JOIN Profesor p ON d.documento_profe = p.documento_identidad
    WHERE d.id_materia = $1;
  `;
  const result = await pool.query(query, [id_materia]);
  return result.rows;
};

// Eliminar una relación Dictar
const deleteDictar = async (id_materiadictada) => {
  const query = `
    DELETE FROM Dictar
    WHERE id_materiadictada = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id_materiadictada]);
  return result.rows[0];
};

//Actualizar materia que da un profesor
const updateMateriaProfesor = async (documento_identidad, id_materia) => {
  const query = `
      UPDATE Dictar 
      SET id_materia = $1 
      WHERE documento_profe = $2
      RETURNING *;
  `;

  const result = await pool.query(query, [id_materia, documento_identidad]);
  return result.rows[0];
};


module.exports = {
  insertDictar,
  getAllDictar,
  getMateriasPorProfesor,
  getProfesoresPorMateria,
  deleteDictar,
  updateMateriaProfesor
};
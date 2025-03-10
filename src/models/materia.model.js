const { consultarDB } = require('../db');

// Insertar una materia
const insertMateria = async (nombre, id_institucion) => {
  // Verificar si ya existe una materia con el mismo nombre en la misma institución
  const checkQuery = `SELECT * FROM Materia WHERE nombre = $1 AND id_institucion = $2 AND activo = TRUE;`;
  const checkResult = await consultarDB(checkQuery, [nombre, id_institucion]);
  if (checkResult.length > 0) {
    throw new Error(`Ya existe una materia con el nombre "${nombre}" en la institución con ID "${id_institucion}"`);
  }

  // Asignar un color aleatorio si no se proporciona uno
  const colores = ['azul', 'amarillo', 'morado'];
  const colorAsignado = colores[Math.floor(Math.random() * colores.length)];

  const query = `
    INSERT INTO Materia (nombre, activo, color, id_institucion)
    VALUES ($1, TRUE, $2, $3)
    RETURNING *;
  `;
  const values = [nombre, colorAsignado, id_institucion];
  const result = await consultarDB(query, values);
  return result[0];
};

// Obtener una materia por su ID
const getMateriaById = async (id_materia) => {
  const query = `
    SELECT * FROM Materia
    WHERE id_materia = $1 AND activo = TRUE;
  `;
  const result = await consultarDB(query, [id_materia]);
  return result[0];
};

// Obtener todas las materias activas
const getAllMaterias = async () => {
  const query = `
    SELECT * FROM Materia
    WHERE activo = TRUE;
  `;
  const result = await consultarDB(query);
  return result;
};

// Obtener todas las materias de una institución específica
const getMateriasByInstitucion = async (id_institucion) => {
  const query = `
    SELECT * FROM Materia
    WHERE id_institucion = $1 AND activo = TRUE;
  `;
  const result = await consultarDB(query, [id_institucion]);
  return result;
};

// Actualizar una materia
const updateMateria = async (id_materia, nombre, id_institucion) => {
  const query = `
    UPDATE Materia
    SET nombre = $1, id_institucion = $2
    WHERE id_materia = $3 AND activo = TRUE
    RETURNING *;
  `;
  const values = [nombre, id_institucion, id_materia];
  const result = await consultarDB(query, values);
  return result[0];
};

// Desactivar una materia (cambiar estado activo a false)
const deleteMateria = async (id_materia) => {
  const query = `
    UPDATE Materia
    SET activo = FALSE
    WHERE id_materia = $1
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_materia]);

  if (result.length > 0) {
    const updateDictarQuery = `
      UPDATE Dictar
      SET estado = FALSE
      WHERE id_materia = $1;
    `;
    await consultarDB(updateDictarQuery, [id_materia]);
  }

  return result[0];
};

// Activar una materia (cambiar estado activo a true)
const activateMateria = async (id_materia) => {
  const query = `
    UPDATE Materia
    SET activo = TRUE
    WHERE id_materia = $1 AND activo = FALSE
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_materia]);

  if (result.length > 0) {
    const updateDictarQuery = `
      UPDATE Dictar
      SET estado = TRUE
      WHERE id_materia = $1;
    `;
    await consultarDB(updateDictarQuery, [id_materia]);
  }

  return result[0];
};

module.exports = {
  insertMateria,
  getMateriaById,
  getAllMaterias,
  getMateriasByInstitucion,
  updateMateria,
  deleteMateria,
  activateMateria,
};
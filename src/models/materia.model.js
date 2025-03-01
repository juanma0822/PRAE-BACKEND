const pool = require('../db');

// Insertar una materia
const insertMateria = async (nombre, institucion) => {
  const client = await pool.connect();
  try {
    // Verificar si ya existe una materia con el mismo nombre en la misma institución
    const checkQuery = `SELECT * FROM Materia WHERE nombre = $1 AND institucion = $2 AND activo = TRUE;`;
    const checkResult = await client.query(checkQuery, [nombre, institucion]);
    if (checkResult.rows.length > 0) {
      throw new Error(`Ya existe una materia con el nombre "${nombre}" en la institución "${institucion}"`);
    }

    // Asignar un color aleatorio si no se proporciona uno
    const colores = ['azul', 'amarillo', 'morado'];
    const colorAsignado = colores[Math.floor(Math.random() * colores.length)];

    const query = `
      INSERT INTO Materia (nombre, activo, color, institucion)
      VALUES ($1, TRUE, $2, $3)
      RETURNING *;
    `;
    const values = [nombre, colorAsignado, institucion];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Obtener una materia por su ID
const getMateriaById = async (id_materia) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM Materia
      WHERE id_materia = $1 AND activo = TRUE;
    `;
    const result = await client.query(query, [id_materia]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Obtener todas las materias activas
const getAllMaterias = async () => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM Materia
      WHERE activo = TRUE;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
};

// Obtener todas las materias de una institución específica
const getMateriasByInstitucion = async (institucion) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM Materia
      WHERE institucion = $1 AND activo = TRUE;
    `;
    const result = await client.query(query, [institucion]);
    return result.rows;
  } finally {
    client.release();
  }
};

// Actualizar una materia
const updateMateria = async (id_materia, nombre, institucion) => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE Materia
      SET nombre = $1, institucion = $2
      WHERE id_materia = $3 AND activo = TRUE
      RETURNING *;
    `;
    const values = [nombre, institucion, id_materia];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Desactivar una materia (cambiar estado activo a false)
const deleteMateria = async (id_materia) => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE Materia
      SET activo = FALSE
      WHERE id_materia = $1
      RETURNING *;
    `;
    const result = await client.query(query, [id_materia]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Activar una materia (cambiar estado activo a true)
const activateMateria = async (id_materia) => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE Materia
      SET activo = TRUE
      WHERE id_materia = $1 AND activo = FALSE
      RETURNING *;
    `;
    const result = await client.query(query, [id_materia]);
    return result.rows[0];
  } finally {
    client.release();
  }
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
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

//Obtener todas las materias con el docente que la da que este ACTIVO de una institucion especìfica
const getMateriasConDocentes = async (id_institucion) => {
  const query = `
    SELECT 
      m.id_materia, 
      m.nombre, 
      m.color, 
      u.documento_identidad AS docente_documento, 
      u.nombre AS docente_nombre, 
      u.apellido AS docente_apellido
    FROM Materia m
    LEFT JOIN Dictar d ON m.id_materia = d.id_materia
    LEFT JOIN Usuario u ON d.documento_profe = u.documento_identidad
    WHERE m.id_institucion = $1 
      AND m.activo = TRUE
      AND d.estado = TRUE
      AND u.activo = TRUE;
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
    // Desactivar las relaciones en la tabla Dictar
    const updateDictarQuery = `
      UPDATE Dictar
      SET estado = FALSE
      WHERE id_materia = $1;
    `;
    await consultarDB(updateDictarQuery, [id_materia]);

    // Desactivar las relaciones en la tabla Asignar
    const updateAsignarQuery = `
      UPDATE Asignar
      SET estado = FALSE
      WHERE id_materia = $1;
    `;
    await consultarDB(updateAsignarQuery, [id_materia]);
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

const getCantidadMateriasPorEstudiante = async (id_estudiante) => {
  const query = `
    SELECT COUNT(DISTINCT m.id_materia) AS cantidad_materias
    FROM Materia m
    JOIN Asignar a ON m.id_materia = a.id_materia
    JOIN Estudiante e ON e.id_curso = a.id_curso
    WHERE e.documento_identidad = $1 AND m.activo = TRUE AND a.estado = TRUE;
  `;
  const result = await consultarDB(query, [id_estudiante]);
  return result[0]?.cantidad_materias || 0; // Retorna 0 si no hay materias
};



module.exports = {
  insertMateria,
  getMateriaById,
  getAllMaterias,
  getMateriasByInstitucion,
  getMateriasConDocentes,
  updateMateria,
  deleteMateria,
  activateMateria,
  getCantidadMateriasPorEstudiante
};
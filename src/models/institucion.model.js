const { consultarDB } = require('../db');

// Insertar una nueva institución
const insertInstitucion = async (nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3) => {
  // Asignar valores por defecto si no se proporcionan
  color_principal = color_principal || '#157AFE';
  color_secundario = color_secundario || '#F5F7F9';
  fondo = fondo || '#FFFFFF';
  color_pildora1 = color_pildora1 || '#157AFE';
  color_pildora2 = color_pildora2 || '#4946E2';
  color_pildora3 = color_pildora3 || '#EF9131';

  const query = `
    INSERT INTO Institucion (nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3, estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)
    RETURNING *;
  `;
  const values = [nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3];
  const result = await consultarDB(query, values);
  return result[0];
};

// Obtener todas las instituciones activas
const getAllInstituciones = async () => {
  const query = `
    SELECT * FROM Institucion
    WHERE estado = TRUE;
  `;
  const result = await consultarDB(query);
  return result;
};

// Obtener una institución por su ID
const getInstitucionById = async (id_institucion) => {
  const query = `
    SELECT * FROM Institucion
    WHERE id_institucion = $1 AND estado = TRUE;
  `;
  const result = await consultarDB(query, [id_institucion]);
  return result[0];
};

// Actualizar una institución
const updateInstitucion = async (id_institucion, nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3) => {
  // Asignar valores por defecto si no se proporcionan
  color_principal = color_principal || '#157AFE';
  color_secundario = color_secundario || '#F5F7F9';
  fondo = fondo || '#FFFFFF';
  color_pildora1 = color_pildora1 || '#157AFE';
  color_pildora2 = color_pildora2 || '#4946E2';
  color_pildora3 = color_pildora3 || '#EF9131';
  
  const query = `
    UPDATE Institucion
    SET nombre = $1, telefono = $2, instagram = $3, facebook = $4, direccion= $5, logo = $6, color_principal = $7, color_secundario = $8, fondo = $9, color_pildora1 = $10, color_pildora2 = $11, color_pildora3 = $12
    WHERE id_institucion = $13 AND estado = TRUE
    RETURNING *;
  `;
  const values = [nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3, id_institucion];
  try {
    const result = await consultarDB(query, values);
    return result[0];
  } catch (error) {
    if (error.code === '23505') { // Código de error para violación de restricción UNIQUE en PostgreSQL
      throw new Error('El nombre de la institución ya existe en nuestra base de datos. Por favor, intenta con otro nombre.');
    }
    throw new Error(`Error al actualizar la institución: ${error.message}`);
  }
};

// Desactivar una institución (cambiar estado a false)
const deleteInstitucion = async (id_institucion) => {
  const query = `
    UPDATE Institucion
    SET estado = FALSE
    WHERE id_institucion = $1
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_institucion]);
  return result[0];
};

// Activar una institución (cambiar estado a true)
const activateInstitucion = async (id_institucion) => {
  const query = `
    UPDATE Institucion
    SET estado = TRUE
    WHERE id_institucion = $1
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_institucion]);
  return result[0];
};

module.exports = {
  insertInstitucion,
  getAllInstituciones,
  getInstitucionById,
  updateInstitucion,
  deleteInstitucion,
  activateInstitucion,
};
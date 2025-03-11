const { consultarDB } = require('../db');

// Insertar una nueva institución
const insertInstitucion = async (nombre, telefono, instagram, facebook, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3) => {
  const query = `
    INSERT INTO Institucion (nombre, telefono, instagram, facebook, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3, estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
    RETURNING *;
  `;
  const values = [nombre, telefono, instagram, facebook, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3];
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
const updateInstitucion = async (id_institucion, nombre, telefono, instagram, facebook, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3) => {
  const query = `
    UPDATE Institucion
    SET nombre = $1, telefono = $2, instagram = $3, facebook = $4, logo = $5, color_principal = $6, color_secundario = $7, fondo = $8, color_pildora1 = $9, color_pildora2 = $10, color_pildora3 = $11
    WHERE id_institucion = $12 AND estado = TRUE
    RETURNING *;
  `;
  const values = [nombre, telefono, instagram, facebook, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3, id_institucion];
  const result = await consultarDB(query, values);
  return result[0];
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

// Desactivar una institución (cambiar estado a false)
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
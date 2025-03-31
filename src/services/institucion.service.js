const institucionModel = require('../models/institucion.model');

// Crear una nueva institución
const createInstitucion = async (nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3) => {
  try {
    const institucion = await institucionModel.insertInstitucion(nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3);
    return institucion;
  } catch (error) {
    throw new Error(`Error al crear la institución: ${error.message}`);
  }
};

// Obtener todas las instituciones activas
const getAllInstituciones = async () => {
  try {
    const instituciones = await institucionModel.getAllInstituciones();
    return instituciones;
  } catch (error) {
    throw new Error(`Error al obtener las instituciones: ${error.message}`);
  }
};

// Obtener una institución por su ID
const getInstitucionById = async (id_institucion) => {
  try {
    const institucion = await institucionModel.getInstitucionById(id_institucion);
    if (!institucion) throw new Error('Institución no encontrada');
    return institucion;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Actualizar una institución
const updateInstitucion = async (id_institucion, nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3) => {
  try {
    const institucion = await institucionModel.updateInstitucion(id_institucion, nombre, telefono, instagram, facebook, direccion, logo, color_principal, color_secundario, fondo, color_pildora1, color_pildora2, color_pildora3);
    if (!institucion) throw new Error('Institución no encontrada');
    return institucion;
  } catch (error) {
    throw new Error(`Error al actualizar la institución: ${error.message}`);
  }
};

// Desactivar una institución (cambiar estado a false)
const deleteInstitucion = async (id_institucion) => {
  try {
    const institucion = await institucionModel.deleteInstitucion(id_institucion);
    if (!institucion) throw new Error('Institución no encontrada');
    return { message: 'Institución desactivada correctamente', institucion };
  } catch (error) {
    throw new Error(`Error al desactivar la institución: ${error.message}`);
  }
};

const activateInstitucion = async (id_institucion) => {
    try {
        const institucion = await institucionModel.activateInstitucion(id_institucion);
        if (!institucion) throw new Error('Institución no encontrada');
        return { message: 'Institución activada correctamente', institucion };
    } catch (error) {
        throw new Error(`Error al activar la institución: ${error.message}`);
    }
}

module.exports = {
  createInstitucion,
  getAllInstituciones,
  getInstitucionById,
  updateInstitucion,
  deleteInstitucion,
  activateInstitucion,
};
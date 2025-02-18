const materiaModel = require('../models/materia.model');

// Crear una materia
const addMateria = async (nombre, color) => {
  try {
    const materia = await materiaModel.insertMateria(nombre, color);
    return materia;
  } catch (error) {
    throw new Error(`Error al crear la materia: ${error.message}`);
  }
};

// Obtener una materia por su ID
const getMateriaById = async (id_materia) => {
  try {
    const materia = await materiaModel.getMateriaById(id_materia);
    if (!materia) throw new Error('Materia no encontrada');
    return materia;
  } catch (error) {
    throw new Error(`Error al obtener la materia: ${error.message}`);
  }
};

// Obtener todas las materias activas
const getAllMaterias = async () => {
  try {
    const materias = await materiaModel.getAllMaterias();
    return materias;
  } catch (error) {
    throw new Error(`Error al obtener las materias: ${error.message}`);
  }
};

// Actualizar una materia
const updateMateria = async (id_materia, nombre) => {
  try {
    const materia = await materiaModel.updateMateria(id_materia, nombre);
    if (!materia) throw new Error('Materia no encontrada');
    return materia;
  } catch (error) {
    throw new Error(`Error al actualizar la materia: ${error.message}`);
  }
};

// Desactivar una materia (cambiar estado activo a false)
const deleteMateria = async (id_materia) => {
  try {
    const materia = await materiaModel.deleteMateria(id_materia);
    if (!materia) throw new Error('Materia no encontrada');
    return { message: 'Materia desactivada correctamente (estado inactivo)', materia };
  } catch (error) {
    throw new Error(`Error al desactivar la materia: ${error.message}`);
  }
};

// Activar una materia (cambiar estado activo a true)
const activateMateria = async (id_materia) => {
  try {
    const materia = await materiaModel.activateMateria(id_materia);
    if (!materia) throw new Error('Materia no encontrada o ya activa');
    return materia;
  } catch (error) {
    throw new Error(`Error al activar la materia: ${error.message}`);
  }
};

module.exports = {
  addMateria,
  getMateriaById,
  getAllMaterias,
  updateMateria,
  deleteMateria,
  activateMateria,
};
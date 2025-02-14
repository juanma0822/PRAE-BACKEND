const dictarModel = require('../models/dictar.model');

// Crear una relación Dictar (asignar una materia a un profesor)
const createDictar = async (documento_profe, id_materia) => {
  try {
    const dictar = await dictarModel.insertDictar(documento_profe, id_materia);
    return dictar;
  } catch (error) {
    throw new Error(`Error al crear la relación Dictar: ${error.message}`);
  }
};



// Obtener todas las relaciones Dictar
const getAllDictar = async () => {
  try {
    const dictar = await dictarModel.getAllDictar();
    return dictar;
  } catch (error) {
    throw new Error(`Error al obtener las relaciones Dictar: ${error.message}`);
  }
};

// Obtener las materias que dicta un profesor
const getMateriasPorProfesor = async (documento_profe) => {
  try {
    const materias = await dictarModel.getMateriasPorProfesor(documento_profe);
    return materias;
  } catch (error) {
    throw new Error(`Error al obtener las materias del profesor: ${error.message}`);
  }
};

// Obtener los profesores que dictan una materia
const getProfesoresPorMateria = async (id_materia) => {
  try {
    const profesores = await dictarModel.getProfesoresPorMateria(id_materia);
    return profesores;
  } catch (error) {
    throw new Error(`Error al obtener los profesores de la materia: ${error.message}`);
  }
};

// Eliminar una relación Dictar (desasignar una materia de un profesor)
const deleteDictar = async (id_materiadictada) => {
  try {
    const dictar = await dictarModel.deleteDictar(id_materiadictada);
    if (!dictar) throw new Error('Relación Dictar no encontrada');
    return { message: 'Relación Dictar eliminada correctamente', dictar };
  } catch (error) {
    throw new Error(`Error al eliminar la relación Dictar: ${error.message}`);
  }
};

module.exports = {
  createDictar,
  getAllDictar,
  getMateriasPorProfesor,
  getProfesoresPorMateria,
  deleteDictar,
};
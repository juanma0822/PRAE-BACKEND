const cursoModel = require('../models/curso.model');

const getCursos = async () => {
    return await cursoModel.getCursos();
};

const getCursoById = async (id) => {
    return await cursoModel.getCursoById(id);
};

const createCurso = async (nombre) => {
    return await cursoModel.createCurso(nombre);
};

const updateCurso = async (id, nombre) => {
    return await cursoModel.updateCurso(id, nombre);
};

const deleteCurso = async (id) => {
    return await cursoModel.deleteCurso(id);
};

const activateCurso = async (id) => {
    return await cursoModel.activateCurso(id);
};

// Buscar curso por nombre
const findCursoByName = async (nombre) => {
    const result = await cursoModel.findCursoByName(nombre);
    return result;
};

// Obtener estudiantes por curso
const obtenerEstudiantesPorCurso = async (id_curso) => {
    try {
      // Llamamos al modelo para obtener los estudiantes por id_curso
      
      const estudiantes = await cursoModel.obtenerEstudiantesPorCurso(id_curso);
      return estudiantes;
    } catch (error) {
      throw new Error('Error al obtener los estudiantes service');
    }
  };

module.exports = {
    getCursos,
    getCursoById,
    createCurso,
    updateCurso,
    deleteCurso,
    activateCurso,
    findCursoByName,
    obtenerEstudiantesPorCurso,
};

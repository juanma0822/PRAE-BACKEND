const cursoModel = require('../models/curso.model');

const getCursos = async () => {
    return await cursoModel.getCursos();
};

const getCursoById = async (id) => {
    return await cursoModel.getCursoById(id);
};

const createCurso = async (nombre, institucion ) => {
    return await cursoModel.createCurso(nombre, institucion );
};

const updateCurso = async (id, nombre, institucion) => {
    return await cursoModel.updateCurso(id, nombre, institucion);
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
      const estudiantes = await cursoModel.obtenerEstudiantesPorCurso(id_curso);
      return estudiantes;
    } catch (error) {
      throw new Error('Error al obtener los estudiantes service');
    }
};

// Obtener todos los cursos de una institución específica
const getCursosByInstitucion = async (institucion) => {
    return await cursoModel.getCursosByInstitucion(institucion);
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
    getCursosByInstitucion,
};
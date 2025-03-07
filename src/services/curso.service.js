const cursoModel = require('../models/curso.model');

const getCursos = async () => {
    return await cursoModel.getCursos();
};

const getCursoById = async (id) => {
    return await cursoModel.getCursoById(id);
};

const createCurso = async (nombre, id_institucion) => {
    return await cursoModel.createCurso(nombre, id_institucion);
};

const updateCurso = async (id, nombre, id_institucion) => {
    return await cursoModel.updateCurso(id, nombre, id_institucion);
};

const deleteCurso = async (id) => {
    return await cursoModel.deleteCurso(id);
};

const activateCurso = async (id) => {
    return await cursoModel.activateCurso(id);
};

const findCursoByName = async (nombre) => {
    const result = await cursoModel.findCursoByName(nombre);
    return result;
};

const obtenerEstudiantesPorCurso = async (id_curso) => {
    try {
        const estudiantes = await cursoModel.obtenerEstudiantesPorCurso(id_curso);
        return estudiantes;
    } catch (error) {
        throw new Error('Error al obtener los estudiantes service');
    }
};

const getCursosByInstitucion = async (id_institucion) => {
    return await cursoModel.getCursosByInstitucion(id_institucion);
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
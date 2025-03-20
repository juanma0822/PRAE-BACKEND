const calificacionModel = require('../models/calificacion.model');

const asignarCalificacion = async (id_actividad, id_estudiante, nota) => {
    return await calificacionModel.insertCalificacion(id_actividad, id_estudiante, nota);
};

const actualizarCalificacion = async (id_calificacion, nota) => {
    return await calificacionModel.updateCalificacion(id_calificacion, nota);
};

const obtenerCalificacionesEstudiante = async (id_materia, id_estudiante) => {
    return await calificacionModel.selectCalificacionesEstudiante(id_materia, id_estudiante);
};

const obtenerCalificacionesEstudiantePorDocenteEInstitucion = async (id_materia, id_estudiante, id_docente, id_institucion) => {
    return await calificacionModel.selectCalificacionesEstudiantePorDocenteEInstitucion(id_materia, id_estudiante, id_docente, id_institucion);
};

const obtenerCalificacionesCurso = async (id_materia, id_curso) => {
    return await calificacionModel.selectCalificacionesCurso(id_materia, id_curso);
};

const obtenerPromedioEstudiante = async (id_materia, id_estudiante) => {
    return await calificacionModel.selectPromedioEstudiante(id_materia, id_estudiante);
};

const obtenerPromedioCurso = async (id_materia, id_curso) => {
    return await calificacionModel.selectPromedioCurso(id_materia, id_curso);
};

module.exports = {
    asignarCalificacion,
    actualizarCalificacion,
    obtenerCalificacionesEstudiante,
    obtenerCalificacionesEstudiantePorDocenteEInstitucion,
    obtenerCalificacionesCurso,
    obtenerPromedioEstudiante,
    obtenerPromedioCurso
};

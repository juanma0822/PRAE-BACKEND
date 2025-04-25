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
    // Obtener las calificaciones de las actividades
    const actividades = await calificacionModel.selectCalificacionesEstudiantePorDocenteEInstitucion(
        id_materia,
        id_estudiante,
        id_docente,
        id_institucion
    );

    // Obtener el promedio general del estudiante
    const promedio_general = await calificacionModel.selectPromedioEstudiante(
        id_materia,
        id_estudiante,
        id_docente
    );

    // Retornar las actividades junto con el promedio general
    return {
        promedio_general,
        actividades,
    };
};

const obtenerCalificacionesCurso = async (id_materia, id_curso, id_docente, id_institucion) => {
    return await calificacionModel.selectCalificacionesCurso(id_materia, id_curso, id_docente, id_institucion);
};

const obtenerPromedioEstudiante = async (id_materia, id_estudiante, id_docente) => {
    return await calificacionModel.selectPromedioEstudiante(id_materia, id_estudiante, id_docente);
};

const obtenerPromedioCurso = async (id_materia, id_curso) => {
    return await calificacionModel.selectPromedioCursoMateria(id_materia, id_curso);
};

const getCalificacionById = async (id_calificacion) => {
    return await calificacionModel.getCalificacionById(id_calificacion);
};

module.exports = {
    asignarCalificacion,
    actualizarCalificacion,
    obtenerCalificacionesEstudiante,
    obtenerCalificacionesEstudiantePorDocenteEInstitucion,
    obtenerCalificacionesCurso,
    obtenerPromedioEstudiante,
    obtenerPromedioCurso,
    getCalificacionById,
};

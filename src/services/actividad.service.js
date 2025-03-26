const actividadModel = require('../models/actividad.model');

const crearActividad = async (nombre, peso, id_materia, id_docente, id_curso) => {
    return await actividadModel.insertActividad(nombre, peso, id_materia, id_docente, id_curso);
};

const obtenerActividadesPorMateria = async (id_materia) => {
    return await actividadModel.selectActividadesPorMateria(id_materia);
};

const obtenerActividadesPorMateriaDocenteInstitucion = async (id_institucion, id_docente, id_materia, id_curso) => {
    return await actividadModel.selectActividadesPorMateriaDocenteInstitucion(id_institucion, id_docente, id_materia, id_curso);
};

const actualizarActividad = async (id_actividad, nombre, peso, id_docente) => {
    return await actividadModel.updateActividad(id_actividad, nombre, peso, id_docente);
};

const eliminarActividad = async (id_actividad) => {
    return await actividadModel.deleteActividad(id_actividad);
};

module.exports = {
    crearActividad,
    obtenerActividadesPorMateria,
    obtenerActividadesPorMateriaDocenteInstitucion,
    actualizarActividad,
    eliminarActividad
};

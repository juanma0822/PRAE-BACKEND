const actividadModel = require('../models/actividad.model');

const crearActividad = async (nombre, peso, id_materia, id_docente) => {
    return await actividadModel.insertActividad(nombre, peso, id_materia, id_docente);
};

const obtenerActividadesPorMateria = async (id_materia) => {
    return await actividadModel.selectActividadesPorMateria(id_materia);
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
    actualizarActividad,
    eliminarActividad
};

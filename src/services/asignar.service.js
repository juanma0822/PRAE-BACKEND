const asignarModel = require('../models/asignar.model');

const asignarMateria = async (id_curso, id_materia) => {
    return await asignarModel.asignarMateria(id_curso, id_materia);
};

const obtenerMateriasPorCurso = async (id_curso) => {
    return await asignarModel.obtenerMateriasPorCurso(id_curso);
};

const eliminarAsignacion = async (id_asignacion) => {
    return await asignarModel.eliminarAsignacion(id_asignacion);
};

module.exports = { asignarMateria, obtenerMateriasPorCurso, eliminarAsignacion };

const estadisticasModel = require('../models/estadisticas.model');

// Obtener estadísticas para el administrador
const getEstadisticasAdmin = async (id_institucion) => {
    return await estadisticasModel.getEstadisticasAdmin(id_institucion);
};

// Obtener estadísticas para el profesor
const getEstadisticasProfesor = async (documento_profe) => {
    return await estadisticasModel.getEstadisticasProfesor(documento_profe);
};

// Obtener estadísticas para el profesor
const getEstadisticasEstudiante = async (documento_estudiante) => {
    return await estadisticasModel.getEstadisticasEstudiante(documento_estudiante);
};

module.exports = {
    getEstadisticasAdmin,
    getEstadisticasProfesor,
    getEstadisticasEstudiante,
};
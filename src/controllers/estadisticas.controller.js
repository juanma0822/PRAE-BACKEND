const estadisticasService = require('../services/estadisticas.service');

// Obtener estadísticas para el administrador
const getEstadisticasAdmin = async (req, res) => {
    try {
        const { id_institucion } = req.params;
        const estadisticas = await estadisticasService.getEstadisticasAdmin(id_institucion);
        res.status(200).json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener estadísticas para el profesor
const getEstadisticasProfesor = async (req, res) => {
    try {
        const { documento_profe } = req.params;
        const estadisticas = await estadisticasService.getEstadisticasProfesor(documento_profe);
        res.status(200).json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener estadísticas para el profesor
const getEstadisticasEstudiante = async (req, res) => {
    try {
        const { documento_estudiante } = req.params;
        const estadisticas = await estadisticasService.getEstadisticasProfesor(documento_estudiante);
        res.status(200).json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getEstadisticasAdmin,
    getEstadisticasProfesor,
    getEstadisticasEstudiante,
};
const actividadService = require('../services/actividad.service');

const crearActividad = async (req, res) => {
    try {
        const { nombre, peso, id_materia, id_docente } = req.body;
        const nuevaActividad = await actividadService.crearActividad(nombre, peso, id_materia, id_docente);
        res.status(201).json(nuevaActividad);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la actividad' });
    }
};

const obtenerActividadesPorMateria = async (req, res) => {
    try {
        const { id_materia } = req.params;
        const actividades = await actividadService.obtenerActividadesPorMateria(id_materia);
        res.status(200).json(actividades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};

const obtenerActividadesPorMateriaDocenteInstitucion = async (req, res) => {
    try {
        const { id_institucion, id_docente, id_materia } = req.params;
        const actividades = await actividadService.obtenerActividadesPorMateriaDocenteInstitucion(id_institucion, id_docente, id_materia);
        res.status(200).json(actividades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};

const actualizarActividad = async (req, res) => {
    try {
        const { id_actividad } = req.params;
        const { nombre, peso, id_docente } = req.body;
        const actividadActualizada = await actividadService.actualizarActividad(id_actividad, nombre, peso, id_docente);
        res.status(200).json(actividadActualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la actividad' });
    }
};

const eliminarActividad = async (req, res) => {
    try {
        const { id_actividad } = req.params;
        const actividadEliminada = await actividadService.eliminarActividad(id_actividad);
        res.status(200).json({ message: 'Actividad eliminada correctamente', actividad: actividadEliminada });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la actividad' });
    }
};

module.exports = {
    crearActividad,
    obtenerActividadesPorMateria,
    obtenerActividadesPorMateriaDocenteInstitucion,
    actualizarActividad,
    eliminarActividad,
};

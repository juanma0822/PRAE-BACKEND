const calificacionService = require('../services/calificacion.service');
const { getIo } = require('../sockets/sockets');

const asignarCalificacion = async (req, res) => {
    try {
        const { id_actividad, id_estudiante, nota } = req.body;
        const nuevaCalificacion = await calificacionService.asignarCalificacion(id_actividad, id_estudiante, nota);

        // Emitir evento de WebSocket para actualizar las notas del estudiante
        const io = getIo();
        io.to(id_estudiante).emit('nuevaCalificacion', nuevaCalificacion);

        res.status(201).json(nuevaCalificacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar calificación' });
    }
};

const actualizarCalificacion = async (req, res) => {
    try {
        const { id_calificacion } = req.params;
        const { nota } = req.body;
        const calificacionActualizada = await calificacionService.actualizarCalificacion(id_calificacion, nota);
        res.status(200).json(calificacionActualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar calificación' });
    }
};

const obtenerCalificacionesEstudiante = async (req, res) => {
    try {
        const { id_materia, id_estudiante } = req.params;
        const calificaciones = await calificacionService.obtenerCalificacionesEstudiante(id_materia, id_estudiante);

        // Emitir evento de WebSocket para actualizar las calificaciones del estudiante
        const io = getIo();
        io.to(id_estudiante).emit('actualizarCalificaciones', calificaciones);

        res.status(200).json(calificaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener calificaciones' });
    }
};

const obtenerCalificacionesCurso = async (req, res) => {
    try {
        const { id_materia, id_curso } = req.params;
        const calificaciones = await calificacionService.obtenerCalificacionesCurso(id_materia, id_curso);

        // Emitir evento de WebSocket para actualizar las calificaciones del curso
        const io = getIo();
        io.to(`curso_${id_curso}`).emit('actualizarCalificacionesCurso', calificaciones);

        res.status(200).json(calificaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener calificaciones del curso' });
    }
};

const obtenerPromedioEstudiante = async (req, res) => {
    try {
        const { id_materia, id_estudiante } = req.params;
        const promedio = await calificacionService.obtenerPromedioEstudiante(id_materia, id_estudiante);
        res.status(200).json({ promedio });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener promedio del estudiante' });
    }
};

const obtenerPromedioCurso = async (req, res) => {
    try {
        const { id_materia, id_curso } = req.params;
        const promedio = await calificacionService.obtenerPromedioCurso(id_materia, id_curso);
        res.status(200).json({ promedio });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener promedio del curso' });
    }
};

module.exports = {
    asignarCalificacion,
    actualizarCalificacion,
    obtenerCalificacionesEstudiante,
    obtenerCalificacionesCurso,
    obtenerPromedioEstudiante,
    obtenerPromedioCurso
};

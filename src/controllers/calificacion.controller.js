const calificacionService = require('../services/calificacion.service');
const usuarioService = require("../services/usuario.service");
const emailService = require('../services/emailService');
const actividadService = require('../services/actividad.service');
const { getIo } = require('../sockets/sockets');

const asignarCalificacion = async (req, res) => {
    try {
        const { id_actividad, id_estudiante, nota } = req.body;

        // Asignar la calificación
        const nuevaCalificacion = await calificacionService.asignarCalificacion(id_actividad, id_estudiante, nota);

        // Obtener información de la actividad y la materia asociada
        const actividad = await actividadService.getActividadById(id_actividad);
        const { nombre_actividad: nombreActividad, nombre_materia: nombreMateria } = actividad;

        // Construir el contenido principal del correo
        const mainContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center; padding: 20px;">
                <h2 style="color: #157AFE;">¡Nueva calificación asignada!</h2>
                <p>Se te ha asignado una calificación en la actividad <strong>${nombreActividad}</strong> de la materia <strong>${nombreMateria}</strong>.</p>
                <p>Revisa tus logros y sigue esforzándote. ¡Tú puedes!</p>
            </div>
        `;

        // Generar el correo completo usando la plantilla genérica sin footer
        const emailContent = emailService.generateEmailTemplate(mainContent, '');

        // Obtener el correo del estudiante
        const estudiante = await usuarioService.getEstudianteById(id_estudiante);
        const { correo } = estudiante;

        // Enviar el correo al estudiante
        await emailService.sendEmail(
            correo,
            'Nueva calificación asignada',
            emailContent
        );

        // Emitir evento de WebSocket para actualizar las notas del estudiante
        const io = getIo();
        io.to(id_estudiante).emit('nuevaCalificacion', nuevaCalificacion);

        res.status(201).json(nuevaCalificacion);
    } catch (error) {
        console.error(error);
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

const obtenerCalificacionesEstudiantePorDocenteEInstitucion = async (req, res) => {
    try {
        const { id_materia, id_estudiante, id_docente, id_institucion } = req.params;
        const calificaciones = await calificacionService.obtenerCalificacionesEstudiantePorDocenteEInstitucion(
            id_materia,
            id_estudiante,
            id_docente,
            id_institucion
        );

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
        const { id_materia, id_curso, id_docente, id_institucion } = req.params;
        const calificaciones = await calificacionService.obtenerCalificacionesCurso(
            id_materia,
            id_curso,
            id_docente,
            id_institucion
        );

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
    obtenerCalificacionesEstudiantePorDocenteEInstitucion,
    obtenerCalificacionesCurso,
    obtenerPromedioEstudiante,
    obtenerPromedioCurso
};

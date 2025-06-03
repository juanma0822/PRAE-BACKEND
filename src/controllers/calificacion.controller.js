const calificacionService = require("../services/calificacion.service");
const usuarioService = require("../services/usuario.service");
const emailService = require("../services/emailService");
const actividadService = require("../services/actividad.service");
const { getIo } = require("../sockets/sockets");
const { emitirEstadisticasProfesor, emitirEstadisticasEstudiante, emitirEstadisticasInstitucion } = require("../sockets/emitStats");

const asignarCalificacion = async (req, res) => {
  try {
    const { id_actividad, id_estudiante, nota } = req.body;

    if (!id_actividad || !id_estudiante || nota === undefined) {
      return res.status(400).json({
        error: "Faltan campos obligatorios",
        detalle: "id_actividad, id_estudiante y nota son requeridos",
      });
    }

    const nuevaCalificacion = await calificacionService.asignarCalificacion(
      id_actividad,
      id_estudiante,
      nota
    );
    const actividad = await actividadService.getActividadById(id_actividad);
    const { nombre_actividad, nombre_materia, id_docente } = actividad;

    const estudiante = await usuarioService.getEstudianteById(id_estudiante);
    const { correo, id_institucion} = estudiante;

    const mainContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center; padding: 20px;">
        <h2 style="color: #157AFE;">¡Nueva calificación asignada!</h2>
        <p>Se te ha asignado una calificación en la actividad <strong>${nombre_actividad}</strong> de la materia <strong>${nombre_materia}</strong>.</p>
        <p>Revisa tus logros y sigue esforzándote. ¡Tú puedes!</p>
      </div>`;

    const emailContent = emailService.generateEmailTemplate(mainContent, "");

    await emailService.sendEmail(
      correo,
      "Nueva calificación asignada",
      emailContent
    );
    getIo().to(id_estudiante).emit("nuevaCalificacion", nuevaCalificacion);
    await emitirEstadisticasProfesor(id_docente);
    await emitirEstadisticasEstudiante(id_estudiante);
    await emitirEstadisticasInstitucion(id_institucion);


    res.status(201).json(nuevaCalificacion);
  } catch (error) {
    console.error("Error al asignar calificación:", error);
    res
      .status(500)
      .json({ error: "Error al asignar calificación", detalle: error.message });
  }
};

const actualizarCalificacion = async (req, res) => {
  try {
    const { id_calificacion } = req.params;
    const { nota } = req.body;

    if (!nota && nota !== 0) {
      return res.status(400).json({
        error: "Nota requerida",
        detalle: "El campo nota es obligatorio",
      });
    }

    const calificacionActualizada = await calificacionService.actualizarCalificacion(id_calificacion, nota);

    // Obtener el id_estudiante del resultado
    const { id_estudiante } = calificacionActualizada;

    const { id_actividad } = await calificacionService.getCalificacionById(
      id_calificacion
    );
    const actividad = await actividadService.getActividadById(id_actividad);
    const { id_docente } = actividad;

    const estudiante = await usuarioService.getEstudianteById(id_estudiante);
    const { id_institucion } = estudiante;

    await emitirEstadisticasInstitucion(id_institucion);


    // Emitir estadísticas al profesor
    await emitirEstadisticasProfesor(id_docente);

    // Emitir estadísticas al estudiante
    await emitirEstadisticasEstudiante(id_estudiante);
    res.status(200).json(calificacionActualizada);
  } catch (error) {
    console.error("Error al actualizar calificación:", error);
    res.status(500).json({
      error: "Error al actualizar calificación",
      detalle: error.message,
    });
  }
};

const obtenerCalificacionesEstudiante = async (req, res) => {
  try {
    const { id_materia, id_estudiante } = req.params;
    const calificaciones =
      await calificacionService.obtenerCalificacionesEstudiante(
        id_materia,
        id_estudiante
      );
    getIo().to(id_estudiante).emit("actualizarCalificaciones", calificaciones);
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener calificaciones",
      detalle: error.message,
    });
  }
};

const obtenerCalificacionesEstudiantePorDocenteEInstitucion = async (req, res) => {
  try {
      const { id_materia, id_estudiante, id_docente, id_institucion } = req.params;

      // Llamar al servicio para obtener las calificaciones y el promedio general
      const { promedio_general, actividades } =
          await calificacionService.obtenerCalificacionesEstudiantePorDocenteEInstitucion(
              id_materia,
              id_estudiante,
              id_docente,
              id_institucion
          );

      // Emitir las calificaciones actualizadas al estudiante
      getIo().to(id_estudiante).emit("actualizarCalificaciones", { promedio_general, actividades });

      // Retornar la respuesta al cliente
      res.status(200).json({ promedio_general, actividades });
  } catch (error) {
      console.error("Error al obtener calificaciones:", error);
      res.status(500).json({
          error: "Error al obtener calificaciones",
          detalle: error.message,
      });
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
    getIo()
      .to(`curso_${id_curso}`)
      .emit("actualizarCalificacionesCurso", calificaciones);
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener calificaciones del curso",
      detalle: error.message,
    });
  }
};

const obtenerPromedioEstudiante = async (req, res) => {
  try {
    const { id_materia, id_estudiante, id_docente } = req.params;
    const promedio = await calificacionService.obtenerPromedioEstudiante(
      id_materia,
      id_estudiante,
      id_docente
    );
    res.status(200).json({ promedio });
  } catch (error) {
    console.error("Error al obtener promedio del estudiante:", error);
    res.status(500).json({
      error: "Error al obtener promedio del estudiante",
      detalle: error.message,
    });
  }
};

const obtenerPromedioCurso = async (req, res) => {
  const { id_materia, id_curso } = req.params;

  try {
    if (!id_materia || !id_curso) {
      return res.status(400).json({
        error: "Parámetros incompletos",
        detalle: "Debe enviar id_materia e id_curso en la URL",
      });
    }

    const promedio = await calificacionService.obtenerPromedioCurso(
      id_materia,
      id_curso
    );

    // Siempre devolvemos el promedio, incluso si es 0
    res.status(200).json({ promedio });
  } catch (error) {
    console.error(
      `[ERROR] promedio curso (materia: ${id_materia}, curso: ${id_curso}):`,
      error.message
    );

    res.status(500).json({
      error: "Error interno del servidor",
      detalle:
        error.message || "Ocurrió un error inesperado al calcular el promedio",
    });
  }
};

module.exports = {
  asignarCalificacion,
  actualizarCalificacion,
  obtenerCalificacionesEstudiante,
  obtenerCalificacionesEstudiantePorDocenteEInstitucion,
  obtenerCalificacionesCurso,
  obtenerPromedioEstudiante,
  obtenerPromedioCurso,
};

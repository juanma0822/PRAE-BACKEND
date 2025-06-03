const actividadService = require('../services/actividad.service');
const materiaService = require('../services/materia.service');
const { emitirEstadisticasProfesor, emitirEstadisticasInstitucion } = require('../sockets/emitStats');

const crearActividad = async (req, res) => {
  try {
    const { id_institucion } = req.user; // Obtener id_institucion del token
    const { nombre, peso, id_materia, id_docente, id_curso } = req.body;

    // Crear la actividad
    const nuevaActividad = await actividadService.crearActividad(
      nombre,
      peso,
      id_materia,
      id_docente,
      id_curso,
      id_institucion // Pasar el id_institucion para obtener el periodo activo
    );

    await emitirEstadisticasInstitucion(id_institucion);
    // Emitir estadísticas al docente
    await emitirEstadisticasProfesor(id_docente);

    res.status(201).json(nuevaActividad);
  } catch (error) {
    res.status(500).json({ error: `Error al crear la actividad: ${error.message}` });
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
      const { id_institucion, id_docente, id_materia, id_curso } = req.params;
      const actividades = await actividadService.obtenerActividadesPorMateriaDocenteInstitucion(id_institucion, id_docente, id_materia, id_curso);
      res.status(200).json(actividades);
    } catch (error) {
      res.status(500).json({ error: `Error al obtener actividades: ${error.message}` });
    }
  };

const actualizarActividad = async (req, res) => {
    try {
        const { id_actividad } = req.params;
        const { nombre, peso, id_docente } = req.body;

        // Obtener la actividad antes de actualizar para saber la materia
        const actividad = await actividadService.getActividadById(id_actividad);
        // Obtener la materia para saber la institución
        const materia = await materiaService.getMateriaById(actividad.id_materia);
        const id_institucion = materia.id_institucion;

        const actividadActualizada = await actividadService.actualizarActividad(id_actividad, nombre, peso, id_docente);

        // Emitir estadísticas
        await emitirEstadisticasProfesor(id_docente);
        await emitirEstadisticasInstitucion(id_institucion);

        res.status(200).json(actividadActualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la actividad' });
    }
};

const eliminarActividad = async (req, res) => {
  try {
    const { id_actividad } = req.params;

    // Obtener la actividad antes de eliminar para saber la materia y docente
    const actividad = await actividadService.getActividadById(id_actividad);
    const materia = await materiaService.getMateriaById(actividad.id_materia);
    const id_institucion = materia.id_institucion;

    const actividadEliminada = await actividadService.eliminarActividad(id_actividad);

    if (actividadEliminada?.id_docente) {
      await emitirEstadisticasProfesor(actividadEliminada.id_docente);
    }
    await emitirEstadisticasInstitucion(id_institucion);

    res.status(200).json({
      message: 'Actividad eliminada correctamente',
      actividad: actividadEliminada
    });
  } catch (error) {
    console.error("Error al eliminar la actividad:", error);
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

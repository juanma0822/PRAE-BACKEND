const actividadModel = require('../models/actividad.model');
const periodoAcademicoService = require('../services/periodoAcademico.service');

const crearActividad = async (nombre, peso, id_materia, id_docente, id_curso, id_institucion) => {
    try {
      // Obtener el periodo activo de la institución
      const periodoActivo = await periodoAcademicoService.getPeriodoActivoByInstitucion(id_institucion);
  
      if (!periodoActivo) {
        throw new Error('No hay un periodo activo para la institución');
      }
  
      const id_periodo = periodoActivo.id_periodo;
  
      // Crear la actividad con el id_periodo obtenido
      return await actividadModel.insertActividad(nombre, peso, id_materia, id_docente, id_curso, id_periodo);
    } catch (error) {
      throw new Error(`Error al crear la actividad: ${error.message}`);
    }
  };

const getActividadById = async (id_actividad) => {
    return await actividadModel.getActividadById(id_actividad);
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
    getActividadById,
    obtenerActividadesPorMateria,
    obtenerActividadesPorMateriaDocenteInstitucion,
    actualizarActividad,
    eliminarActividad
};

const calificacionModel = require('../models/calificacion.model');
const periodoAcademicoService = require('../services/periodoAcademico.service'); // Importar el servicio de periodos académicos

const asignarCalificacion = async (id_actividad, id_estudiante, nota) => {
    return await calificacionModel.insertCalificacion(id_actividad, id_estudiante, nota);
};

const actualizarCalificacion = async (id_calificacion, nota) => {
    return await calificacionModel.updateCalificacion(id_calificacion, nota);
};

const obtenerCalificacionesEstudiante = async (id_materia, id_estudiante) => {
    return await calificacionModel.selectCalificacionesEstudiante(id_materia, id_estudiante);
};

const obtenerCalificacionesEstudiantePorDocenteEInstitucion = async (id_materia, id_estudiante, id_docente, id_institucion) => {
    // Obtener las calificaciones de las actividades
    const actividades = await calificacionModel.selectCalificacionesEstudiantePorDocenteEInstitucion(
        id_materia,
        id_estudiante,
        id_docente,
        id_institucion
    );

    // Obtener el promedio general del estudiante
    const promedio_general = await calificacionModel.selectPromedioEstudiante(
        id_materia,
        id_estudiante,
        id_docente
    );

    // Retornar las actividades junto con el promedio general
    return {
        promedio_general,
        actividades,
    };
};

const obtenerCalificacionesCurso = async (id_materia, id_curso, id_docente, id_institucion) => {
    try {
      // Obtener el periodo activo de la institución
      const periodoActivo = await periodoAcademicoService.getPeriodoActivoByInstitucion(id_institucion);
  
      if (!periodoActivo) {
        throw new Error('No hay un periodo activo para la institución');
      }
  
      const id_periodo = periodoActivo.id_periodo;
  
      // Llamar al modelo con el id_periodo incluido
      return await calificacionModel.selectCalificacionesCurso(id_materia, id_curso, id_docente, id_institucion, id_periodo);
    } catch (error) {
      throw new Error(`Error al obtener calificaciones del curso: ${error.message}`);
    }
  };

const obtenerPromedioEstudiante = async (id_materia, id_estudiante, id_docente) => {
    return await calificacionModel.selectPromedioEstudiante(id_materia, id_estudiante, id_docente);
};

const obtenerPromedioCurso = async (id_materia, id_curso) => {
    return await calificacionModel.selectPromedioCursoMateria(id_materia, id_curso);
};

const getCalificacionById = async (id_calificacion) => {
    return await calificacionModel.getCalificacionById(id_calificacion);
};

//Prueba optimizacion de carga de notas
const obtenerCalificacionesCursoOptimizado = async (id_materia, id_curso, id_docente, id_institucion) => {
  const periodoActivo = await periodoAcademicoService.getPeriodoActivoByInstitucion(id_institucion);
  if (!periodoActivo) {
    throw new Error('No hay un periodo activo para la institución');
  }

  return await calificacionModel.selectCalificacionesCursoOptimizado(
    id_materia,
    id_curso,
    id_docente,
    id_institucion
  );
};


module.exports = {
    asignarCalificacion,
    actualizarCalificacion,
    obtenerCalificacionesEstudiante,
    obtenerCalificacionesEstudiantePorDocenteEInstitucion,
    obtenerCalificacionesCurso,
    obtenerPromedioEstudiante,
    obtenerPromedioCurso,
    getCalificacionById,
    obtenerCalificacionesCursoOptimizado,
};

const { consultarDB } = require('../db');

// === ESTADÍSTICAS PARA ADMIN (POR INSTITUCIÓN) ===
const getEstadisticasAdmin = async (id_institucion) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM Usuario WHERE rol = 'docente' AND id_institucion = $1 AND activo = TRUE) AS docentes_activos,
        (SELECT COUNT(*) FROM Usuario WHERE rol = 'docente' AND id_institucion = $1 AND activo = FALSE) AS docentes_inactivos,
        (SELECT COUNT(*) FROM Usuario WHERE rol = 'estudiante' AND id_institucion = $1 AND activo = TRUE) AS estudiantes_activos,
        (SELECT COUNT(*) FROM Usuario WHERE rol = 'estudiante' AND id_institucion = $1 AND activo = FALSE) AS estudiantes_inactivos,
        (SELECT COUNT(*) FROM Materia WHERE id_institucion = $1 AND activo = TRUE) AS materias_activas,
        (SELECT COUNT(*) FROM Materia WHERE id_institucion = $1 AND activo = FALSE) AS materias_inactivas,
        (SELECT COUNT(*) FROM Curso WHERE id_institucion = $1 AND activo = TRUE) AS cursos_activos,
        (SELECT COUNT(*) FROM Curso WHERE id_institucion = $1 AND activo = FALSE) AS cursos_inactivos,
        (SELECT COUNT(*) FROM Asignar a JOIN Curso c ON a.id_curso = c.id_curso WHERE c.id_institucion = $1) AS docentes_asignados,
        (SELECT COUNT(*) FROM Actividades a JOIN Materia m ON a.id_materia = m.id_materia WHERE m.id_institucion = $1) AS total_actividades,
        (SELECT COUNT(*) FROM Calificacion c JOIN Actividades a ON c.id_actividad = a.id_actividad JOIN Materia m ON a.id_materia = m.id_materia WHERE m.id_institucion = $1) AS total_calificaciones
    `;
    const result = await consultarDB(query, [id_institucion]);
    return result[0];
  } catch (error) {
    throw new Error(`Error al obtener estadísticas del admin: ${error.message}`);
  }
};

// === ESTADÍSTICAS PARA DOCENTE (POR DOCUMENTO) ===
const getEstadisticasProfesor = async (documento_profe) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM Dictar WHERE documento_profe = $1 AND estado = TRUE) AS materias_dictadas,
        (SELECT COUNT(*) FROM Asignar WHERE id_docente = $1 AND estado = TRUE) AS cursos_asignados,
        (SELECT COUNT(*) FROM Actividades WHERE id_docente = $1 AND activo = TRUE) AS actividades_creadas,
        (SELECT COUNT(*) FROM Calificacion c JOIN Actividades a ON c.id_actividad = a.id_actividad WHERE a.id_docente = $1) AS calificaciones_asignadas,
        (SELECT COUNT(*) FROM Comentarios WHERE documento_profe = $1) AS comentarios_realizados
    `;
    const result = await consultarDB(query, [documento_profe]);
    return result[0];
  } catch (error) {
    throw new Error(`Error al obtener estadísticas del docente: ${error.message}`);
  }
};

// === ESTADÍSTICAS PARA ESTUDIANTE (POR DOCUMENTO) ===
const getEstadisticasEstudiante = async (documento_estudiante) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM Asignar a
         JOIN Estudiante e ON a.id_curso = e.id_curso
         WHERE e.documento_identidad = $1 AND a.estado = TRUE) AS materias_inscritas,
        (SELECT COUNT(*) FROM Actividades a
         JOIN Estudiante e ON a.id_curso = e.id_curso
         WHERE e.documento_identidad = $1 AND a.activo = TRUE) AS actividades_asignadas,
        (SELECT COUNT(*) FROM Calificacion WHERE id_estudiante = $1 AND activo = TRUE) AS calificaciones_recibidas,
        (SELECT COALESCE(ROUND(AVG(nota), 2), 0.0) FROM Calificacion WHERE id_estudiante = $1 AND activo = TRUE) AS promedio_general,
        (SELECT COUNT(*) FROM Comentarios WHERE documento_estudiante = $1) AS comentarios_recibidos
    `;
    const result = await consultarDB(query, [documento_estudiante]);
    return result[0];
  } catch (error) {
    throw new Error(`Error al obtener estadísticas del estudiante: ${error.message}`);
  }
};

module.exports = {
  getEstadisticasAdmin,
  getEstadisticasProfesor,
  getEstadisticasEstudiante
};

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
      // Primero obtenemos las estadísticas generales
      const result = await consultarDB(query, [id_institucion]);
  
      // **Obtenemos la cantidad de estudiantes por grado**
      const estudiantesPorGradoQuery = `
        SELECT c.nombre AS curso, COUNT(e.documento_identidad) AS estudiantes
        FROM Estudiante e
        JOIN Curso c ON e.id_curso = c.id_curso
        WHERE c.id_institucion = $1
        GROUP BY c.id_curso
      `;
      const estudiantesPorGrado = await consultarDB(estudiantesPorGradoQuery, [id_institucion]);
  
      // **Obtenemos el promedio de notas por grado**
      // Esta consulta ahora incluye solo las calificaciones activas
      const promedioNotasPorGradoQuery = `
        SELECT c.nombre AS curso, ROUND(AVG(cal.nota), 2) AS promedio
        FROM Calificacion cal
        JOIN Estudiante e ON cal.id_estudiante = e.documento_identidad
        JOIN Curso c ON e.id_curso = c.id_curso
        WHERE c.id_institucion = $1
        AND cal.activo = TRUE
        GROUP BY c.id_curso
      `;
      const promedioNotasPorGrado = await consultarDB(promedioNotasPorGradoQuery, [id_institucion]);
  
      // **Promediar las calificaciones por materia en cada curso**
      // Para cada curso, sumamos las calificaciones activas de cada materia y promediamos
      const promedioNotasPorMateriaQuery = `
        SELECT c.nombre AS curso, m.nombre AS materia, ROUND(AVG(cal.nota), 2) AS promedio_materia
        FROM Calificacion cal
        JOIN Estudiante e ON cal.id_estudiante = e.documento_identidad
        JOIN Curso c ON e.id_curso = c.id_curso
        JOIN Actividades a ON cal.id_actividad = a.id_actividad
        JOIN Materia m ON a.id_materia = m.id_materia
        WHERE c.id_institucion = $1
        AND cal.activo = TRUE
        GROUP BY c.id_curso, m.id_materia
      `;
      const promedioNotasPorMateria = await consultarDB(promedioNotasPorMateriaQuery, [id_institucion]);
  
      // Agregamos las estadísticas de estudiantes, promedio de notas y promedio por materia
      const estadisticas = {
        ...result[0], // Estadísticas generales
        estudiantes_por_grado: estudiantesPorGrado.reduce((acc, item) => {
          acc[item.curso] = item.estudiantes;
          return acc;
        }, {}),
        promedio_notas_por_grado: promedioNotasPorGrado.reduce((acc, item) => {
          acc[item.curso] = item.promedio;
          return acc;
        }, {}),
        promedio_notas_por_materia: promedioNotasPorMateria.reduce((acc, item) => {
          acc[`${item.curso}_${item.materia}`] = item.promedio_materia;
          return acc;
        }, {})
      };
  
      return estadisticas;
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

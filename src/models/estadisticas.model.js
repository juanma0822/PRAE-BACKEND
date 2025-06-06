const { consultarDB } = require("../db");

// Función segura para consultas a la DB
const safeConsultarDB = async (query, params) => {
  try {
    const result = await consultarDB(query, params);
    return result || []; // Retorna arreglo vacío si es null o undefined
  } catch (error) {
    console.error("Error en consulta a la base de datos:", error);
    return []; // Retorna arreglo vacío para evitar bloqueo
  }
};
// === ESTADÍSTICAS PARA ADMIN (POR INSTITUCIÓN) ===
const getEstadisticasAdmin = async (id_institucion) => {
  try {
    // Estadísticas generales optimizadas
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE rol = 'docente' AND activo = TRUE) AS docentes_activos,
        COUNT(*) FILTER (WHERE rol = 'docente' AND activo = FALSE) AS docentes_inactivos,
        COUNT(*) FILTER (WHERE rol = 'estudiante' AND activo = TRUE) AS estudiantes_activos,
        COUNT(*) FILTER (WHERE rol = 'estudiante' AND activo = FALSE) AS estudiantes_inactivos
      FROM Usuario
      WHERE id_institucion = $1;
    `;

    const query2 = `
      SELECT
        COUNT(*) FILTER (WHERE activo = TRUE) AS materias_activas,
        COUNT(*) FILTER (WHERE activo = FALSE) AS materias_inactivas
      FROM Materia
      WHERE id_institucion = $1;
    `;

    const query3 = `
      SELECT
        COUNT(*) FILTER (WHERE activo = TRUE) AS cursos_activos,
        COUNT(*) FILTER (WHERE activo = FALSE) AS cursos_inactivos
      FROM Curso
      WHERE id_institucion = $1;
    `;

    const query4 = `
      SELECT
        (SELECT COUNT(*) FROM Asignar a JOIN Curso c ON a.id_curso = c.id_curso WHERE c.id_institucion = $1) AS docentes_asignados,
        (SELECT COUNT(*) FROM Actividades a JOIN Materia m ON a.id_materia = m.id_materia WHERE m.id_institucion = $1) AS total_actividades,
        (SELECT COUNT(*) FROM Calificacion c JOIN Actividades a ON c.id_actividad = a.id_actividad JOIN Materia m ON a.id_materia = m.id_materia WHERE m.id_institucion = $1) AS total_calificaciones
    `;

    const [usuarios] = await safeConsultarDB(query, [id_institucion]);
    const [materias] = await safeConsultarDB(query2, [id_institucion]);
    const [cursos] = await safeConsultarDB(query3, [id_institucion]);
    const [otros] = await safeConsultarDB(query4, [id_institucion]);

    // Estudiantes por grado
    const estudiantesPorGradoQuery = `
      SELECT c.nombre AS curso, COUNT(e.documento_identidad) AS estudiantes
      FROM Estudiante e
      JOIN Usuario u ON e.documento_identidad = u.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      WHERE c.id_institucion = $1
        AND u.activo = TRUE
      GROUP BY c.id_curso;
    `;

    const estudiantesPorGrado = await safeConsultarDB(
      estudiantesPorGradoQuery,
      [id_institucion]
    );

    // Promedio de notas por materia
    const promedioNotasPorMateriaQuery = `
      SELECT 
      c.nombre AS curso, 
      m.nombre AS materia, 
      ROUND(AVG(cal.nota), 2) AS promedio_materia
      FROM Calificacion cal
      JOIN Estudiante e ON cal.id_estudiante = e.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      JOIN Actividades a ON cal.id_actividad = a.id_actividad
      JOIN Materia m ON a.id_materia = m.id_materia
      JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
      WHERE c.id_institucion = $1
        AND cal.activo = TRUE
        AND a.activo = TRUE
        AND p.estado = TRUE -- ✅ solo del periodo activo
      GROUP BY c.id_curso, m.id_materia, c.nombre, m.nombre;
    `;

    const promedioNotasPorMateria = await safeConsultarDB(
      promedioNotasPorMateriaQuery,
      [id_institucion]
    );

    // Ajustar el formato de promedio_notas_por_materia
    const promedioNotasPorMateriaAjustado = promedioNotasPorMateria.reduce(
      (acc, item) => {
        const { curso, materia, promedio_materia } = item;

        if (!acc[curso]) {
          acc[curso] = {};
        }

        acc[curso][materia] = promedio_materia;
        return acc;
      },
      {}
    );

    // Promedio de notas por grado (filtrando por periodo activo)
    const promedioNotasPorGradoAjustado = {};

    for (const curso in promedioNotasPorMateriaAjustado) {
      const materias = promedioNotasPorMateriaAjustado[curso];
      const promedios = Object.values(materias).map((n) => parseFloat(n));

      if (promedios.length > 0) {
        const suma = promedios.reduce((acc, val) => acc + val, 0);
        const promedio = (suma / promedios.length).toFixed(2);
        promedioNotasPorGradoAjustado[curso] = promedio;
      } else {
        promedioNotasPorGradoAjustado[curso] = "0.00";
      }
    }

    // Promedio de notas por grado acumulado (ponderado por el peso de los periodos)
    const promedioNotasPorGradoAcumuladoQuery = `
      WITH promedio_estudiante_materia_periodo AS (
        SELECT 
          c.nombre AS curso,
          p.nombre AS periodo,
          p.peso AS peso_periodo,
          m.id_materia,
          e.documento_identidad,
          SUM(cal.nota * (a.peso / 100.0)) AS promedio_ponderado_estudiante
        FROM Calificacion cal
        JOIN Estudiante e ON cal.id_estudiante = e.documento_identidad
        JOIN Curso c ON e.id_curso = c.id_curso
        JOIN Actividades a ON cal.id_actividad = a.id_actividad
        JOIN Materia m ON a.id_materia = m.id_materia
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
        WHERE cal.activo = TRUE
          AND a.activo = TRUE
          AND c.id_institucion = $1
        GROUP BY c.nombre, p.nombre, p.peso, m.id_materia, e.documento_identidad
      ),
      promedio_materia_periodo AS (
        SELECT 
          curso,
          periodo,
          peso_periodo,
          id_materia,
          ROUND(AVG(promedio_ponderado_estudiante), 2) AS promedio_materia
        FROM promedio_estudiante_materia_periodo
        GROUP BY curso, periodo, peso_periodo, id_materia
      ),
      promedio_curso_periodo AS (
        SELECT 
          curso,
          periodo,
          peso_periodo,
          ROUND(AVG(promedio_materia), 2) AS promedio_periodo
        FROM promedio_materia_periodo
        GROUP BY curso, periodo, peso_periodo
      )
      SELECT * FROM promedio_curso_periodo;
    `;

    const promedioNotasPorGradoAcumulado = await safeConsultarDB(
      promedioNotasPorGradoAcumuladoQuery,
      [id_institucion]
    );

    // Ajustar el formato de promedio_notas_por_grado
    const promedioNotasPorGradoAcumuladoAjustado =
      promedioNotasPorGradoAcumulado.reduce((acc, item) => {
        const { curso, periodo, peso_periodo, promedio_periodo } = item;

        if (!acc[curso]) {
          acc[curso] = {};
        }

        // Multiplicar el promedio del periodo por el peso del periodo
        acc[curso][periodo] = (promedio_periodo * (peso_periodo / 100)).toFixed(
          2
        );

        return acc;
      }, {});

    // Consulta para obtener los periodos académicos de la institución
    const periodosQuery = `
      SELECT nombre
      FROM PeriodoAcademico
      WHERE id_institucion = $1;
    `;

    const periodos = await safeConsultarDB(periodosQuery, [id_institucion]);

    // Asegurar que todos los periodos estén presentes y calcular el total
    for (const curso in promedioNotasPorGradoAcumuladoAjustado) {
      let total = 0;

      periodos.forEach((periodo) => {
        const { nombre: periodoNombre } = periodo;

        // Si el periodo no tiene un valor, asignar 0
        if (!promedioNotasPorGradoAcumuladoAjustado[curso][periodoNombre]) {
          promedioNotasPorGradoAcumuladoAjustado[curso][periodoNombre] = "0.00";
        }

        // Sumar los valores al total
        total += parseFloat(
          promedioNotasPorGradoAcumuladoAjustado[curso][periodoNombre]
        );
      });

      // Agregar el total al curso
      promedioNotasPorGradoAcumuladoAjustado[curso].total = total.toFixed(2);
    }

    // Asegurar que los cursos sin datos también tengan periodos con 0
    const cursosConDatos = Object.keys(promedioNotasPorGradoAcumuladoAjustado);
    const cursosQuery = `
      SELECT nombre AS curso
      FROM Curso
      WHERE id_institucion = $1 AND activo= TRUE;
    `;
    const cursosSinDatos = await safeConsultarDB(cursosQuery, [id_institucion]);

    cursosSinDatos.forEach((curso) => {
      if (!cursosConDatos.includes(curso.curso)) {
        promedioNotasPorGradoAcumuladoAjustado[curso.curso] = {};

        let total = 0;

        periodos.forEach((periodo) => {
          promedioNotasPorGradoAcumuladoAjustado[curso.curso][periodo.nombre] =
            "0.00";
        });

        promedioNotasPorGradoAcumuladoAjustado[curso.curso].total =
          total.toFixed(2);
      }
    });

    return {
      usuarios,
      materias,
      cursos,
      otros,
      estudiantes_por_grado: estudiantesPorGrado.reduce((acc, item) => {
        acc[item.curso] = item.estudiantes;
        return acc;
      }, {}),
      promedio_notas_por_materia: promedioNotasPorMateriaAjustado,
      promedio_notas_por_grado: promedioNotasPorGradoAjustado,
      promedio_notas_por_grado_acumulado:
        promedioNotasPorGradoAcumuladoAjustado,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas del admin:", error);
    return {
      usuarios: null,
      materias: null,
      cursos: null,
      otros: null,
      estudiantes_por_grado: {},
      promedio_notas_por_materia: {},
      promedio_notas_por_grado: {},
      promedio_notas_por_grado_acumulado: {},
    };
  }
};

// === ESTADÍSTICAS PARA PROFESOR (POR I.D) ===
const getEstadisticasProfesor = async (documento_profe) => {
  try {
    // Resumen de estadísticas
    const queryResumen = `
      SELECT
        (SELECT COUNT(*) FROM Dictar WHERE documento_profe = $1 AND estado = TRUE) AS materias_dictadas,
        (SELECT COUNT(*) FROM Asignar WHERE id_docente = $1 AND estado = TRUE) AS cursos_asignados,
        (SELECT COUNT(*) FROM Actividades WHERE id_docente = $1 AND activo = TRUE) AS actividades_creadas,
        (SELECT COUNT(*) FROM Calificacion c JOIN Actividades a ON c.id_actividad = a.id_actividad WHERE a.id_docente = $1) AS calificaciones_asignadas,
        (SELECT COUNT(*) FROM Comentarios WHERE documento_profe = $1) AS comentarios_realizados,
        (SELECT COUNT(DISTINCT e.documento_identidad)
        FROM Asignar asig
        JOIN Estudiante e ON e.id_curso = asig.id_curso
        WHERE asig.id_docente = $1 AND asig.estado = TRUE) AS estudiantes_totales,
        (SELECT ROUND(AVG(c.nota), 2)
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo AND p.estado = TRUE
        WHERE a.id_docente = $1 AND c.activo = TRUE) AS promedio_general
    `;

    // Detalle de promedios por curso, materia y estudiante
    const queryDetallePromedios = `
      SELECT 
        curso.id_curso,
        curso.nombre AS curso,
        materia.nombre AS materia,
        usuario.nombre AS estudiante_nombre,
        usuario.apellido AS estudiante_apellido,
        ROUND(SUM(COALESCE(calificacion.nota, 0) * (actividad.peso / 100.0)), 2) AS promedio
      FROM Estudiante estudiante
      JOIN Usuario usuario ON usuario.documento_identidad = estudiante.documento_identidad AND usuario.activo = TRUE
      JOIN Actividades actividad ON actividad.id_docente = $1 AND actividad.id_curso = estudiante.id_curso AND actividad.activo = TRUE
      JOIN PeriodoAcademico p ON actividad.id_periodo = p.id_periodo AND p.estado = TRUE
      JOIN Materia materia ON materia.id_materia = actividad.id_materia AND materia.activo = TRUE
      JOIN Curso curso ON curso.id_curso = actividad.id_curso AND curso.activo = TRUE
      LEFT JOIN Calificacion calificacion 
        ON calificacion.id_actividad = actividad.id_actividad 
        AND calificacion.id_estudiante = estudiante.documento_identidad 
        AND calificacion.activo = TRUE
      GROUP BY curso.id_curso, curso.nombre, materia.nombre, usuario.nombre, usuario.apellido
      ORDER BY curso.nombre, materia.nombre, usuario.nombre;
    `;

    // Promedio general por curso para los cursos del profesor
    const queryPromedioCursoGeneral = `
      SELECT
        sub.curso AS curso,
        ROUND(AVG(sub.promedio), 2) AS promedio_general
      FROM (
        SELECT 
          curso.id_curso,
          curso.nombre AS curso,
          e.documento_identidad,
          SUM(COALESCE(cal.nota, 0) * (a.peso / 100.0)) AS promedio
        FROM Estudiante e
        JOIN Actividades a ON a.id_docente = $1 AND a.id_curso = e.id_curso AND a.activo = TRUE
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo AND p.estado = TRUE
        JOIN Curso curso ON curso.id_curso = e.id_curso AND curso.activo = TRUE
        LEFT JOIN Calificacion cal ON cal.id_actividad = a.id_actividad AND cal.id_estudiante = e.documento_identidad AND cal.activo = TRUE
        GROUP BY curso.id_curso, curso.nombre, e.documento_identidad
      ) AS sub
      GROUP BY sub.curso;
    `;

    // Ejecutar las consultas
    const [resumen] = await consultarDB(queryResumen, [documento_profe]);
    const detalle = await consultarDB(queryDetallePromedios, [documento_profe]);
    const promediosGenerales = await consultarDB(queryPromedioCursoGeneral, [
      documento_profe,
    ]);

    // Inicializar objetos para resultados
    const promedio_por_curso = {};
    const acumulado_por_materia = {};

    // Obtener todos los cursos activos asignados al profesor
    const cursosAsignadosQuery = `
      SELECT DISTINCT c.nombre AS curso
      FROM Curso c
      JOIN Asignar a ON a.id_curso = c.id_curso
      WHERE a.id_docente = $1 AND a.estado = TRUE AND c.activo = TRUE
    `;
    const cursosAsignados = await consultarDB(cursosAsignadosQuery, [documento_profe]);

    // Asegurar que todos los cursos estén en promedio_por_curso
    cursosAsignados.forEach(({ curso }) => {
      if (!promedio_por_curso[curso]) {
        promedio_por_curso[curso] = {
          promedioCurso: 0
        };
      }
    });

    // Agrupar los resultados de calificaciones por curso y materia
    detalle.forEach(
      ({
        curso,
        materia,
        estudiante_nombre,
        estudiante_apellido,
        promedio,
      }) => {
        if (!promedio_por_curso[curso]) promedio_por_curso[curso] = {};
        if (!promedio_por_curso[curso][materia])
          promedio_por_curso[curso][materia] = {
            promedioMateria: 0,
            estudiantes: {},
          };

        promedio_por_curso[curso][materia].estudiantes[
          `${estudiante_nombre} ${estudiante_apellido}`
        ] = Number(promedio);

        const key = `${curso}_${materia}`;
        if (!acumulado_por_materia[key]) acumulado_por_materia[key] = [];
        acumulado_por_materia[key].push(Number(promedio));
      }
    );

    // Calcular promedio por materia
    for (const key in acumulado_por_materia) {
      const [curso, materia] = key.split("_");
      const valores = acumulado_por_materia[key];
      const promedioMateria = parseFloat(
        (valores.reduce((acc, v) => acc + v, 0) / valores.length).toFixed(2)
      );
      promedio_por_curso[curso][materia].promedioMateria = promedioMateria;

      // Acumular los promedios de las materias para calcular el promedio del curso
      if (!promedio_por_curso[curso].materias)
        promedio_por_curso[curso].materias = [];
      promedio_por_curso[curso].materias.push(promedioMateria);
    }

    // Calcular promedio general por curso
    for (const curso in promedio_por_curso) {
      const materias = promedio_por_curso[curso].materias || [];
      const promedioCurso =
        materias.length > 0
          ? parseFloat(
              (
                materias.reduce((acc, v) => acc + v, 0) / materias.length
              ).toFixed(2)
            )
          : 0;
      promedio_por_curso[curso].promedioCurso = promedioCurso;
      delete promedio_por_curso[curso].materias; // Eliminar el campo temporal
    }

    // Agregar la cantidad de estudiantes a cada curso en especifico
    const estudiantesPorCursoQuery = `
      SELECT c.nombre AS curso, COUNT(e.documento_identidad) AS total_estudiantes
      FROM Curso c
      JOIN Estudiante e ON e.id_curso = c.id_curso
      JOIN Asignar a ON a.id_curso = c.id_curso
      WHERE a.id_docente = $1 AND a.estado = TRUE AND c.activo = TRUE
      GROUP BY c.nombre
    `;
    const estudiantesPorCurso = await consultarDB(estudiantesPorCursoQuery, [documento_profe]);

    // Agregar el total de estudiantes a cada curso en promedio_por_curso
    estudiantesPorCurso.forEach(({ curso, total_estudiantes }) => {
      if (promedio_por_curso[curso]) {
        promedio_por_curso[curso].totalEstudiantes = Number(total_estudiantes);
      } else {
        promedio_por_curso[curso] = {
          promedioCurso: 0,
          totalEstudiantes: Number(total_estudiantes)
        };
      }
    });

    // Retornar los resultados
    return {
      ...resumen,
      promedio_por_curso,
    };
  } catch (error) {
    throw new Error(
      `Error al obtener estadísticas del docente: ${error.message}`
    );
  }
};

// === ESTADÍSTICAS PARA ESTUDIANTE (POR DOCUMENTO) ===
const getEstadisticasEstudiante = async (documento_estudiante) => {
  try {
    const query = `
      WITH materias_promedio AS (
        SELECT 
          m.id_materia,
          m.nombre AS nombre_materia,
          a.id_docente,
          u.nombre AS nombre_docente,
          u.apellido AS apellido_docente,
          ROUND(SUM(COALESCE(c.nota, 0) * (a.peso / 100.0)), 2) AS promedio_materia
        FROM Estudiante e
        JOIN Curso cu ON cu.id_curso = e.id_curso
        JOIN Asignar asg ON asg.id_curso = cu.id_curso AND asg.estado = TRUE
        JOIN Materia m ON m.id_materia = asg.id_materia AND m.activo = TRUE
        LEFT JOIN Actividades a ON a.id_materia = m.id_materia AND a.activo = TRUE
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo 
        LEFT JOIN Calificacion c ON c.id_actividad = a.id_actividad AND c.id_estudiante = e.documento_identidad AND c.activo = TRUE
        LEFT JOIN Usuario u ON a.id_docente = u.documento_identidad
        WHERE e.documento_identidad = $1
          AND p.estado = TRUE
        GROUP BY m.id_materia, m.nombre, a.id_docente, u.nombre, u.apellido
      ),

      promedio_general AS (
        SELECT ROUND(AVG(promedio_materia), 2) AS promedio FROM materias_promedio
      ),

      cantidad_profesores AS (
        SELECT COUNT(DISTINCT a.id_docente) AS total_profesores
        FROM Asignar a
        JOIN Estudiante e ON e.id_curso = a.id_curso
        WHERE e.documento_identidad = $1 AND a.estado = TRUE
      ),

      materias_clasificadas AS (
        SELECT
          SUM(CASE WHEN promedio_materia >= 4.5 THEN 1 ELSE 0 END) AS materias_altas,
          SUM(CASE WHEN promedio_materia >= 3.0 AND promedio_materia < 4.5 THEN 1 ELSE 0 END) AS materias_medias,
          SUM(CASE WHEN promedio_materia < 3.0 THEN 1 ELSE 0 END) AS materias_bajas
        FROM materias_promedio
      ),

      promedios_por_periodo AS (
        SELECT 
          p.nombre AS periodo,
          ROUND(AVG(c.nota), 2) AS promedio_periodo
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
        WHERE c.id_estudiante = $1 AND c.activo = TRUE
        GROUP BY p.id_periodo, p.nombre
      ),

      promedio_periodo_actual AS (
        SELECT 
          ROUND(AVG(c.nota), 2) AS promedio_actual
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
        WHERE c.id_estudiante = $1 AND c.activo = TRUE AND p.estado = TRUE
      ),

      resumen_base AS (
        SELECT
          (SELECT COUNT(*) FROM Asignar a JOIN Estudiante e ON a.id_curso = e.id_curso WHERE e.documento_identidad = $1 AND a.estado = TRUE) AS materias_inscritas,
          (SELECT COUNT(*) FROM Actividades a JOIN Estudiante e ON a.id_curso = e.id_curso WHERE e.documento_identidad = $1 AND a.activo = TRUE) AS actividades_asignadas,
          (SELECT COUNT(*) FROM Calificacion c
          JOIN Actividades a ON c.id_actividad = a.id_actividad
          JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
          WHERE c.id_estudiante = $1 AND c.activo = TRUE AND a.activo = TRUE AND p.estado = TRUE) AS calificaciones_recibidas,
          (SELECT COUNT(*) FROM Comentarios WHERE documento_estudiante = $1) AS comentarios_recibidos
      ),

      promedio_por_materia_est AS (
        SELECT 
          c.id_estudiante AS documento_identidad,
          a.id_materia,
          SUM(c.nota * (a.peso / 100.0)) AS promedio_materia
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo AND p.estado = TRUE
        WHERE a.id_curso = (SELECT id_curso FROM Estudiante WHERE documento_identidad = $1)
          AND c.activo = TRUE
        GROUP BY c.id_estudiante, a.id_materia
      ),

      promedios_finales_est AS (
        SELECT 
          documento_identidad,
          ROUND(AVG(promedio_materia), 2) AS promedio
        FROM promedio_por_materia_est
        GROUP BY documento_identidad
      ),

      ranking_estudiantes AS (
        SELECT 
          documento_identidad,
          RANK() OVER (ORDER BY promedio DESC, documento_identidad ASC) AS puesto
        FROM promedios_finales_est
      )

      SELECT 
        rb.materias_inscritas,
        rb.actividades_asignadas,
        rb.calificaciones_recibidas,
        rb.comentarios_recibidos,
        pg.promedio,
        cp.total_profesores,
        mc.materias_altas,
        mc.materias_medias,
        mc.materias_bajas,
        json_agg(json_build_object(
          'materia', mp.nombre_materia,
          'docente', CONCAT(mp.nombre_docente, ' ', mp.apellido_docente),
          'promedio', mp.promedio_materia
        )) AS promedios_por_materia,
        (SELECT puesto FROM ranking_estudiantes WHERE documento_identidad = $1) AS puesto
      FROM resumen_base rb, promedio_general pg, cantidad_profesores cp, materias_clasificadas mc, materias_promedio mp
      GROUP BY rb.materias_inscritas, rb.actividades_asignadas, rb.calificaciones_recibidas, rb.comentarios_recibidos, pg.promedio, cp.total_profesores, mc.materias_altas, mc.materias_medias, mc.materias_bajas;
    `;

    const result = await consultarDB(query, [documento_estudiante]);
    return result[0];
  } catch (error) {
    throw new Error(
      `Error al obtener estadísticas del estudiante: ${error.message}`
    );
  }
};

module.exports = {
  getEstadisticasAdmin,
  getEstadisticasProfesor,
  getEstadisticasEstudiante,
};

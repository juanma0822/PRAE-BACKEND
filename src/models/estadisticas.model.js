const { consultarDB } = require("../db");

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

    const [usuarios] = await consultarDB(query, [id_institucion]);
    const [materias] = await consultarDB(query2, [id_institucion]);
    const [cursos] = await consultarDB(query3, [id_institucion]);
    const [otros] = await consultarDB(query4, [id_institucion]);

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

    const estudiantesPorGrado = await consultarDB(estudiantesPorGradoQuery, [
      id_institucion,
    ]);

    // Promedio de notas por materia
    const promedioNotasPorMateriaQuery = `
      SELECT c.nombre AS curso, m.nombre AS materia, ROUND(AVG(cal.nota), 2) AS promedio_materia
      FROM Calificacion cal
      JOIN Estudiante e ON cal.id_estudiante = e.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      JOIN Actividades a ON cal.id_actividad = a.id_actividad
      JOIN Materia m ON a.id_materia = m.id_materia
      WHERE c.id_institucion = $1
        AND cal.activo = TRUE
      GROUP BY c.id_curso, m.id_materia, c.nombre, m.nombre;
    `;

    const promedioNotasPorMateria = await consultarDB(
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
    const promedioNotasPorGradoQuery = `
      SELECT c.nombre AS curso, ROUND(AVG(cal.nota), 2) AS promedio
      FROM Calificacion cal
      JOIN Estudiante e ON cal.id_estudiante = e.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      JOIN Actividades a ON cal.id_actividad = a.id_actividad
      WHERE c.id_institucion = $1
        AND cal.activo = TRUE
        AND a.id_periodo = (SELECT id_periodo FROM PeriodoAcademico WHERE id_institucion = $1 AND estado = TRUE LIMIT 1)  -- Filtra por el periodo activo
      GROUP BY c.id_curso;
    `;

    const promedioNotasPorGrado = await consultarDB(
      promedioNotasPorGradoQuery,
      [id_institucion]
    );

    // Ajustar el formato de promedio_notas_por_grado
    const promedioNotasPorGradoAjustado = promedioNotasPorGrado.reduce(
      (acc, item) => {
        const { curso, promedio } = item;
        acc[curso] = promedio;
        return acc;
      },
      {}
    );

    // Promedio de notas por grado acumulado (ponderado por el peso de los periodos)
    const promedioNotasPorGradoAcumuladoQuery = `
      SELECT 
        c.nombre AS curso, 
        p.nombre AS periodo, 
        p.peso AS peso_periodo,
        ROUND(AVG(cal.nota), 2) AS promedio_periodo
      FROM Calificacion cal
      JOIN Estudiante e ON cal.id_estudiante = e.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      JOIN Actividades a ON cal.id_actividad = a.id_actividad
      JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
      WHERE c.id_institucion = $1
      AND cal.activo = TRUE
      GROUP BY c.id_curso, p.id_periodo, p.nombre, p.peso;
    `;

    const promedioNotasPorGradoAcumulado = await consultarDB(
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

    const periodos = await consultarDB(periodosQuery, [id_institucion]);

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
    const cursosSinDatos = await consultarDB(cursosQuery, [id_institucion]);

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
    throw new Error(
      `Error al obtener estadísticas del admin: ${error.message}`
    );
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
         JOIN Actividades a ON c.id_actividad = a.id_actividad
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
        JOIN Materia m ON m.id_materia = asg.id_materia
        LEFT JOIN Actividades a ON a.id_materia = m.id_materia AND a.activo = TRUE
        LEFT JOIN Calificacion c ON c.id_actividad = a.id_actividad AND c.id_estudiante = e.documento_identidad AND c.activo = TRUE
        LEFT JOIN Usuario u ON a.id_docente = u.documento_identidad
        WHERE e.documento_identidad = $1
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
      notas_clasificadas AS (
        SELECT
          SUM(CASE WHEN c.nota >= 4.5 THEN 1 ELSE 0 END) AS notas_altas,
          SUM(CASE WHEN c.nota >= 3.0 AND c.nota < 4.5 THEN 1 ELSE 0 END) AS notas_medias,
          SUM(CASE WHEN c.nota < 3.0 THEN 1 ELSE 0 END) AS notas_bajas
        FROM Calificacion c
        WHERE c.id_estudiante = $1 AND c.activo = TRUE
      ),
      promedios_por_periodo AS (
        SELECT 
          p.nombre AS periodo,
          ROUND(AVG(c.nota), 2) AS promedio_periodo
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
        WHERE c.id_estudiante = $1 AND c.activo = TRUE
        GROUP BY p.id_periodo, p.nombre
      ),
      promedio_periodo_actual AS (
        SELECT 
          ROUND(AVG(c.nota), 2) AS promedio_actual
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
        WHERE c.id_estudiante = $1 AND c.activo = TRUE AND p.estado = TRUE
      ),
      resumen_base AS (
        SELECT
          (SELECT COUNT(*) FROM Asignar a JOIN Estudiante e ON a.id_curso = e.id_curso WHERE e.documento_identidad = $1 AND a.estado = TRUE) AS materias_inscritas,
          (SELECT COUNT(*) FROM Actividades a JOIN Estudiante e ON a.id_curso = e.id_curso WHERE e.documento_identidad = $1 AND a.activo = TRUE) AS actividades_asignadas,
          (SELECT COUNT(*) FROM Calificacion WHERE id_estudiante = $1 AND activo = TRUE) AS calificaciones_recibidas,
          (SELECT COUNT(*) FROM Comentarios WHERE documento_estudiante = $1) AS comentarios_recibidos
      ),
      puesto_estudiante AS (
        SELECT 
          e.documento_identidad,
          ROUND(AVG(COALESCE(c.nota, 0) * (a.peso / 100.0)), 2) AS promedio
        FROM Estudiante e
        LEFT JOIN Calificacion c ON e.documento_identidad = c.id_estudiante AND c.activo = TRUE
        LEFT JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        WHERE e.id_curso = (SELECT id_curso FROM Estudiante WHERE documento_identidad = $1)
        GROUP BY e.documento_identidad
        ORDER BY promedio DESC, e.documento_identidad ASC
      )

      SELECT 
        rb.materias_inscritas,
        rb.actividades_asignadas,
        rb.calificaciones_recibidas,
        rb.comentarios_recibidos,
        pg.promedio,
        cp.total_profesores,
        nc.notas_altas,
        nc.notas_medias,
        nc.notas_bajas,
        json_agg(json_build_object(
          'materia', mp.nombre_materia,
          'docente', CONCAT(mp.nombre_docente, ' ', mp.apellido_docente),
          'promedio', mp.promedio_materia
        )) AS promedios_por_materia,
        (SELECT RANK() OVER (ORDER BY promedio DESC) FROM puesto_estudiante WHERE documento_identidad = $1) AS puesto
      FROM resumen_base rb, promedio_general pg, cantidad_profesores cp, notas_clasificadas nc, materias_promedio mp
      GROUP BY rb.materias_inscritas, rb.actividades_asignadas, rb.calificaciones_recibidas, rb.comentarios_recibidos, pg.promedio, cp.total_profesores, nc.notas_altas, nc.notas_medias, nc.notas_bajas;
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

const { consultarDB } = require("../db");

const insertCalificacion = async (id_actividad, id_estudiante, nota) => {
  const query = `
        INSERT INTO Calificacion (id_actividad, id_estudiante, nota) 
        VALUES ($1, $2, $3) RETURNING *`;
  const values = [id_actividad, id_estudiante, nota];
  const result = await consultarDB(query, values);
  return result[0];
};

const updateCalificacion = async (id_calificacion, nota) => {
  const query = `
        UPDATE Calificacion 
        SET nota = $1 
        WHERE id_calificacion = $2 RETURNING *`;
  const values = [nota, id_calificacion];
  const result = await consultarDB(query, values);
  return result[0];
};

const selectCalificacionesEstudiante = async (id_materia, id_estudiante) => {
  const query = `
        SELECT c.id_calificacion, c.nota, a.nombre AS actividad, c.id_actividad
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad
        WHERE a.id_materia = $1 AND c.id_estudiante = $2`;
  const result = await consultarDB(query, [id_materia, id_estudiante]);
  return result;
};

const selectCalificacionesEstudiantePorDocenteEInstitucion = async (
  id_materia,
  id_estudiante,
  id_docente,
  id_institucion
) => {
  // Obtener los periodos de la institución
  const periodosQuery = `
    SELECT id_periodo, nombre, peso, estado
    FROM PeriodoAcademico
    WHERE id_institucion = $1;
  `;
  const periodos = await consultarDB(periodosQuery, [id_institucion]);

  // Obtener el curso del estudiante
  const cursoQuery = `
    SELECT id_curso FROM Estudiante WHERE documento_identidad = $1;
  `;
  const cursoResult = await consultarDB(cursoQuery, [id_estudiante]);
  const id_curso = cursoResult[0]?.id_curso;

  const resultByPeriod = {};

  for (const periodo of periodos) {
    const queryWithActivities = `
      SELECT 
        a.id_actividad,
        a.nombre AS actividad,
        a.peso,
        c.nota,
        c.id_calificacion
      FROM Actividades a
      LEFT JOIN Calificacion c 
        ON a.id_actividad = c.id_actividad 
        AND c.id_estudiante = $2
        AND c.activo = TRUE
      WHERE a.id_materia = $1 
        AND a.id_docente = $3
        AND a.id_periodo = $4
        AND a.id_curso = $5
        AND a.activo = TRUE
      ORDER BY a.nombre ASC;
    `;

    const actividades = await consultarDB(queryWithActivities, [
      id_materia,
      id_estudiante,
      id_docente,
      periodo.id_periodo,
      id_curso,
    ]);

    // Cálculo del promedio del periodo y valor neto
    let sumaPonderada = 0;
    let sumaPesos = 0;

    const actividadesProcesadas = actividades.map((row) => {
      const peso = parseFloat(row.peso) || 0;
      const nota = parseFloat(row.nota) || 0;
      const valorFinal = (nota * peso) / 100;

      sumaPonderada += valorFinal;
      sumaPesos += peso;

      return {
        id_actividad: row.id_actividad,
        actividad: row.actividad,
        peso: row.peso,
        nota: row.nota,
        id_calificacion: row.id_calificacion,
        valorFinal: valorFinal.toFixed(2)
      };
    });

    const promedio_periodo = sumaPesos > 0 ? (sumaPonderada).toFixed(2) : "0.00";
    const valor_neto = (parseFloat(promedio_periodo) * (parseFloat(periodo.peso) / 100)).toFixed(2);

    resultByPeriod[periodo.id_periodo] = {
      estado: periodo.estado,
      nombre: periodo.nombre,
      peso: periodo.peso,
      promedio_periodo,
      valor_neto,
      actividades: actividadesProcesadas,
    };
  }

  return resultByPeriod;
};


const selectCalificacionesCurso = async (
  id_materia,
  id_curso,
  id_docente,
  id_institucion
) => {
  // Primero obtenemos los periodos de la institución, incluyendo su id y estado
  const periodosQuery = `
    SELECT id_periodo, nombre, estado
    FROM PeriodoAcademico
    WHERE id_institucion = $1;
  `;
  
  const periodos = await consultarDB(periodosQuery, [id_institucion]);

  const resultByPeriod = {};

  // Iteramos sobre los periodos
  for (const periodo of periodos) {
    const checkActivitiesQuery = `
      SELECT COUNT(*) 
      FROM Actividades a
      WHERE a.id_materia = $1 AND a.id_curso = $2 AND a.id_docente = $3 AND a.activo = TRUE AND a.id_periodo = $4;
    `;
    
    const activityCount = await consultarDB(checkActivitiesQuery, [
      id_materia,
      id_curso,
      id_docente,
      periodo.id_periodo
    ]);

    // Si hay actividades, realizamos la consulta de calificaciones con actividades
    if (activityCount[0].count > 0) {
      const queryWithActivities = `
        SELECT 
            u.documento_identidad, 
            u.nombre, 
            u.apellido, 
            COALESCE(c.nota, 0) AS nota,
            c.id_calificacion, 
            a.nombre AS actividad, 
            a.peso,
            a.id_actividad,
            e.id_curso
        FROM Estudiante e
        LEFT JOIN Usuario u ON e.documento_identidad = u.documento_identidad
        LEFT JOIN Actividades a ON a.id_materia = $1 AND a.id_docente = $3 AND a.id_curso = $2 AND a.activo = TRUE AND a.id_periodo = $4
        LEFT JOIN Calificacion c ON c.id_actividad = a.id_actividad AND c.id_estudiante = e.documento_identidad
        JOIN Materia m ON a.id_materia = m.id_materia
        WHERE e.id_curso = $2 
          AND m.id_institucion = $5
          AND u.activo = TRUE 
        ORDER BY u.nombre ASC;
      `;

      const result = await consultarDB(queryWithActivities, [
        id_materia,
        id_curso,
        id_docente,
        periodo.id_periodo,
        id_institucion,
      ]);

      // Agrupamos los resultados por estudiante
      const groupedResult = result.reduce((acc, row) => {
        const {
          documento_identidad,
          nombre,
          apellido,
          nota,
          id_calificacion,
          actividad,
          peso,
          id_actividad,
          id_curso,
        } = row;

        if (!acc[documento_identidad]) {
          acc[documento_identidad] = {
            documento_identidad,
            nombre,
            apellido,
            id_curso,
            actividades: [],
          };
        }

        // Solo añadimos actividades si existen
        if (actividad) {
          acc[documento_identidad].actividades.push({
            id_actividad,
            actividad,
            peso,
            nota,
            id_calificacion,
          });
        } else {
          // Si no hay actividad, mostramos "Sin actividad asignada"
          acc[documento_identidad].actividades.push({
            id_actividad: null,
            actividad: "Sin actividad asignada",
            peso: 0,
            nota,
            id_calificacion: null,
          });
        }

        return acc;
      }, {});

      // Añadimos el resultado agrupado por estudiante bajo el periodo correspondiente
      resultByPeriod[periodo.id_periodo] = {
        estado: periodo.estado,
        nombre: periodo.nombre,
        estudiantes: Object.values(groupedResult).sort((a, b) =>
          a.apellido.localeCompare(b.apellido)
        ),
      };
    } else {
      // Si no hay actividades, simplemente traemos la lista de estudiantes
      const queryOnlyStudents = `
        SELECT 
            u.documento_identidad, 
            u.nombre, 
            u.apellido,
            e.id_curso
        FROM Estudiante e
        LEFT JOIN Usuario u ON e.documento_identidad = u.documento_identidad
        WHERE e.id_curso = $1 
          AND u.activo = TRUE 
        ORDER BY u.nombre ASC;
      `;

      const studentsResult = await consultarDB(queryOnlyStudents, [id_curso]);

      // Agrupamos solo estudiantes sin actividades
      resultByPeriod[periodo.id_periodo] = {
        estado: periodo.estado,
        nombre: periodo.nombre,
        estudiantes: studentsResult.map((student) => ({
          documento_identidad: student.documento_identidad,
          nombre: student.nombre,
          apellido: student.apellido,
          id_curso: student.id_curso,
          actividades: [], // No hay actividades
        })),
      };
    }
  }

  return resultByPeriod;
};



const selectPromedioEstudiante = async (id_materia, id_estudiante, id_docente) => {
  const query = `
    SELECT 
      p.nombre AS periodo,
      p.peso AS peso_periodo,
      ROUND(AVG(c.nota), 2) AS promedio_periodo,
      ROUND(AVG(c.nota) * (p.peso / 100.0), 2) AS valor_neto
    FROM Calificacion c
    JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
    JOIN PeriodoAcademico p ON a.id_periodo = p.id_periodo
    WHERE a.id_materia = $1 
      AND c.id_estudiante = $2
      AND a.id_docente = $3
      AND c.activo = TRUE
    GROUP BY p.nombre, p.peso
    ORDER BY p.nombre;
  `;

  const rows = await consultarDB(query, [id_materia, id_estudiante, id_docente]);

  // Calcular el promedio general acumulado (ponderado)
  const promedio_general = rows.reduce(
    (acc, row) => acc + parseFloat(row.valor_neto || 0),
    0
  ).toFixed(2);

  return {
    promedio_general,
    periodos: rows.map(r => ({
      periodo: r.periodo,
      promedio_periodo: r.promedio_periodo,
      valor_neto: r.valor_neto,
      peso: r.peso_periodo
    }))
  };
};


const selectPromedioCursoMateria = async (id_materia, id_curso) => {
  const query = `
    WITH promedio_por_estudiante_periodo AS (
      SELECT 
        p.id_periodo,
        p.nombre AS periodo,
        p.peso AS peso_periodo,
        e.documento_identidad,
        COALESCE(SUM(c.nota * (a.peso / 100.0)), 0) AS promedio_ponderado_estudiante
      FROM PeriodoAcademico p
      JOIN Actividades a ON a.id_periodo = p.id_periodo AND a.id_materia = $1 AND a.id_curso = $2 AND a.activo = TRUE
      JOIN Estudiante e ON e.id_curso = $2
      JOIN Usuario u ON e.documento_identidad = u.documento_identidad AND u.activo = TRUE
      LEFT JOIN Calificacion c ON c.id_actividad = a.id_actividad AND c.id_estudiante = e.documento_identidad AND c.activo = TRUE
      GROUP BY p.id_periodo, p.nombre, p.peso, e.documento_identidad
    )
    SELECT
      periodo,
      peso_periodo,
      ROUND(AVG(promedio_ponderado_estudiante), 2) AS promedio_base
    FROM promedio_por_estudiante_periodo
    GROUP BY periodo, peso_periodo
    ORDER BY periodo;
  `;

  const rows = await consultarDB(query, [id_materia, id_curso]);

  let promedioGeneral = 0;

  const promediosPorPeriodo = rows.map(({ periodo, peso_periodo, promedio_base }) => {
    const pesoDecimal = peso_periodo / 100;
    const promedioPonderado = parseFloat((promedio_base * pesoDecimal).toFixed(2));
    promedioGeneral += promedioPonderado;
    return {
      periodo,
      promedioBase: parseFloat(promedio_base),
      promedioPonderado,
    };
  });

  return {
    promediosPorPeriodo,
    promedioGeneral: parseFloat(promedioGeneral.toFixed(2)),
  };
};


const getCalificacionById = async (id_calificacion) => {
  const query = `
      SELECT * FROM Calificacion
      WHERE id_calificacion = $1;
    `;
  const result = await consultarDB(query, [id_calificacion]);
  return result[0];
};

module.exports = {
  insertCalificacion,
  updateCalificacion,
  selectCalificacionesEstudiante,
  selectCalificacionesEstudiantePorDocenteEInstitucion,
  selectCalificacionesCurso,
  selectPromedioEstudiante,
  selectPromedioCursoMateria,
  getCalificacionById,
};

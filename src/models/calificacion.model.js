const { consultarDB } = require('../db');

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

const selectCalificacionesEstudiantePorDocenteEInstitucion = async (id_materia, id_estudiante, id_docente, id_institucion) => {
    const query = `
        SELECT 
            a.id_actividad,
            a.nombre AS actividad,
            a.peso,
            COALESCE(c.nota, 0) AS nota,
            c.id_calificacion
        FROM Actividades a
        LEFT JOIN Calificacion c ON a.id_actividad = c.id_actividad AND c.id_estudiante = $2
        JOIN Materia m ON a.id_materia = m.id_materia
        WHERE a.id_materia = $1 
          AND a.id_docente = $3 
          AND m.id_institucion = $4
          AND a.activo = TRUE
          AND c.activo = TRUE;
    `;
    const result = await consultarDB(query, [id_materia, id_estudiante, id_docente, id_institucion]);
    return result;
};

const selectCalificacionesCurso = async (id_materia, id_curso, id_docente, id_institucion) => {
    // Primero, comprobamos si hay actividades para esa materia y curso
    const checkActivitiesQuery = `
        SELECT COUNT(*) 
        FROM Actividades a
        WHERE a.id_materia = $1 AND a.id_curso = $2 AND a.id_docente = $3 AND a.activo = TRUE;
    `;
    
    const activityCount = await consultarDB(checkActivitiesQuery, [id_materia, id_curso, id_docente]);

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
            LEFT JOIN Actividades a ON a.id_materia = $1 AND a.id_docente = $3 AND a.id_curso = $2 AND a.activo = TRUE
            LEFT JOIN Calificacion c ON c.id_actividad = a.id_actividad AND c.id_estudiante = e.documento_identidad
            JOIN Materia m ON a.id_materia = m.id_materia
            WHERE e.id_curso = $2 
              AND m.id_institucion = $4
              AND u.activo = TRUE 
            ORDER BY u.nombre ASC;
        `;
        
        const result = await consultarDB(queryWithActivities, [id_materia, id_curso, id_docente, id_institucion]);

        // Agrupar los resultados: Aseguramos que siempre haya un listado de estudiantes
        const groupedResult = result.reduce((acc, row) => {
            const { documento_identidad, nombre, apellido, nota, id_calificacion, actividad, peso, id_actividad, id_curso } = row;
            
            if (!acc[documento_identidad]) {
                acc[documento_identidad] = {
                    documento_identidad,
                    nombre,
                    apellido,
                    id_curso,  // Añadir id_curso aquí
                    actividades: []
                };
            }

            // Solo añadimos actividades si existen
            if (actividad) {
                acc[documento_identidad].actividades.push({ id_actividad, actividad, peso, nota, id_calificacion });
            } else {
                // Si no hay actividad, mostramos "Sin actividad asignada"
                acc[documento_identidad].actividades.push({ id_actividad: null, actividad: "Sin actividad asignada", peso: 0, nota, id_calificacion: null });
            }

            return acc;
        }, {});

        return Object.values(groupedResult).sort((a, b) => a.apellido.localeCompare(b.apellido));
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

        // Agrupar solo estudiantes sin actividades
        return studentsResult.map((student) => ({
            documento_identidad: student.documento_identidad,
            nombre: student.nombre,
            apellido: student.apellido,
            id_curso: student.id_curso,
            actividades: []  // No hay actividades
        }));
    }
};


const selectPromedioEstudiante = async (id_materia, id_estudiante, id_docente) => {
    const query = `
        SELECT 
            CASE 
                WHEN SUM(a.peso) > 0 THEN SUM(c.nota * (a.peso / 100.0)) / SUM(a.peso / 100.0)
                ELSE 0
            END AS promedio
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        WHERE a.id_materia = $1 
          AND c.id_estudiante = $2
          AND a.id_docente = $3;
    `;
    const result = await consultarDB(query, [id_materia, id_estudiante, id_docente]);
    return result[0]?.promedio || 0; // Retorna 0 si no hay calificaciones
};

const selectPromedioCursoMateria = async (id_materia, id_curso) => {
    const query = `
      SELECT 
        u.nombre,
        u.apellido,
        ROUND(SUM(COALESCE(c.nota, 0) * (a.peso / 100.0)), 2) AS promedio
      FROM Estudiante e
      JOIN Usuario u ON u.documento_identidad = e.documento_identidad
      JOIN Actividades a ON a.id_materia = $1 AND a.id_curso = $2 AND a.activo = TRUE
      LEFT JOIN Calificacion c 
        ON c.id_actividad = a.id_actividad 
        AND c.id_estudiante = e.documento_identidad 
        AND c.activo = TRUE
      WHERE e.id_curso = $2
      GROUP BY u.nombre, u.apellido;
    `;
  
    const rows = await consultarDB(query, [id_materia, id_curso]);
  
    // Calcular promedio general del curso
    const promedioCurso = rows.length > 0
      ? parseFloat((rows.reduce((acc, r) => acc + parseFloat(r.promedio), 0) / rows.length).toFixed(2))
      : 0;
  
    // Construir respuesta como JSON personalizado
    const resultado = {
      promedioCurso,
    };
  
    rows.forEach((row) => {
      const key = `${row.nombre} ${row.apellido}`;
      resultado[key] = parseFloat(row.promedio);
    });
  
    return resultado;
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
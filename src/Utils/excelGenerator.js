const ExcelJS = require('exceljs');

async function generarExcelEstadisticasAdmin(estadisticas) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Estadísticas Admin');

  // 1. Usuarios
  sheet.addSection = (title) => {
    sheet.addRow([]);
    sheet.addRow([title]).font = { bold: true, size: 14 };
  };

  sheet.addSection('Usuarios');
  sheet.addRow(['Docentes activos', estadisticas.usuarios.docentes_activos]);
  sheet.addRow(['Docentes inactivos', estadisticas.usuarios.docentes_inactivos]);
  sheet.addRow(['Estudiantes activos', estadisticas.usuarios.estudiantes_activos]);
  sheet.addRow(['Estudiantes inactivos', estadisticas.usuarios.estudiantes_inactivos]);

  // 2. Materias
  sheet.addSection('Materias');
  sheet.addRow(['Materias activas', estadisticas.materias.materias_activas]);
  sheet.addRow(['Materias inactivas', estadisticas.materias.materias_inactivas]);

  // 3. Cursos
  sheet.addSection('Cursos');
  sheet.addRow(['Cursos activos', estadisticas.cursos.cursos_activos]);
  sheet.addRow(['Cursos inactivos', estadisticas.cursos.cursos_inactivos]);

  // 4. Otros
  sheet.addSection('Otros');
  sheet.addRow(['Docentes asignados', estadisticas.otros.docentes_asignados]);
  sheet.addRow(['Total actividades', estadisticas.otros.total_actividades]);
  sheet.addRow(['Total calificaciones', estadisticas.otros.total_calificaciones]);

  // 5. Estudiantes por grado
  sheet.addSection('Estudiantes por grado');
  sheet.addRow(['Curso', 'Cantidad']);
  Object.entries(estadisticas.estudiantes_por_grado).forEach(([curso, cantidad]) => {
    sheet.addRow([curso, cantidad]);
  });

  // 6. Promedio de notas por materia
  sheet.addSection('Promedio de notas por materia');
  sheet.addRow(['Curso', 'Materia', 'Promedio']);
  Object.entries(estadisticas.promedio_notas_por_materia).forEach(([curso, materias]) => {
    Object.entries(materias).forEach(([materia, promedio]) => {
      sheet.addRow([curso, materia, promedio]);
    });
  });

  // 7. Promedio de notas por grado (periodo activo)
  sheet.addSection('Promedio de notas por grado (periodo activo)');
  sheet.addRow(['Curso', 'Promedio']);
  Object.entries(estadisticas.promedio_notas_por_grado).forEach(([curso, promedio]) => {
    sheet.addRow([curso, promedio]);
  });

  // 8. Promedio de notas por grado acumulado (todos los periodos)
  sheet.addSection('Promedio de notas por grado acumulado');
  // Encabezados dinámicos según periodos
  const periodos = estadisticas.promedio_notas_por_grado_acumulado
    ? Object.values(estadisticas.promedio_notas_por_grado_acumulado)[0]
      ? Object.keys(Object.values(estadisticas.promedio_notas_por_grado_acumulado)[0])
      : []
    : [];
  sheet.addRow(['Curso', ...periodos]);
  Object.entries(estadisticas.promedio_notas_por_grado_acumulado).forEach(([curso, promedios]) => {
    const row = [curso];
    periodos.forEach((periodo) => {
      row.push(promedios[periodo] || '0.00');
    });
    sheet.addRow(row);
  });

  // Devuelve el buffer
  return await workbook.xlsx.writeBuffer();
}

module.exports = { generarExcelEstadisticasAdmin };
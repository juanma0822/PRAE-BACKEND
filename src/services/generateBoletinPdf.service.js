const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { consultarDB } = require("../db");
require("dotenv").config();

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

const generateBoletinPdf = async (documento_identidad) => {
  try {
    const infoQuery = `
      SELECT u.documento_identidad, u.nombre, u.apellido, u.correo, u.id_institucion,
             c.nombre AS curso, c.id_curso,
             i.nombre AS institucion, i.logo, i.color_principal, i.color_secundario, i.fondo,
             i.color_pildora1, i.color_pildora2, i.color_pildora3
      FROM Usuario u
      JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      JOIN Institucion i ON u.id_institucion = i.id_institucion
      WHERE u.documento_identidad = $1 AND u.activo = TRUE;
    `;
    const [estudiante] = await consultarDB(infoQuery, [documento_identidad]);

    if (!estudiante) throw new Error("Estudiante no encontrado o inactivo");

    // 1. Obtener el periodo vigente (estado = TRUE)
    const periodoQuery = `
      SELECT id_periodo, nombre 
      FROM PeriodoAcademico 
      WHERE id_institucion = $1 AND estado = TRUE
      LIMIT 1;
    `;
    const [periodoVigente] = await consultarDB(periodoQuery, [
      estudiante.id_institucion,
    ]);
    if (!periodoVigente) throw new Error("No hay periodo académico vigente");

    // 2. Traer solo las notas del periodo vigente
    const notasQuery = `
      SELECT 
        m.nombre AS materia, 
        m.color,
        a.nombre AS actividad, 
        a.peso,
        c.nota,
        p.documento_identidad AS doc_profe, 
        up.nombre AS nombre_profe, 
        up.apellido AS apellido_profe
      FROM Calificacion c
      INNER JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
      INNER JOIN Materia m ON a.id_materia = m.id_materia AND m.activo = TRUE
      INNER JOIN Profesor p ON a.id_docente = p.documento_identidad
      INNER JOIN Usuario up ON p.documento_identidad = up.documento_identidad
      WHERE c.id_estudiante = $1 
        AND c.activo = TRUE
        AND a.id_periodo = $2
      ORDER BY m.nombre, a.nombre;
    `;
    const notas = await consultarDB(notasQuery, [
      documento_identidad,
      periodoVigente.id_periodo,
    ]);

    // Calcular promedios
    const materiasMap = {};
    let sumaPromediosMaterias = 0;
    let cantidadMaterias = 0;

    for (const n of notas) {
      let colorBase = n.color?.toLowerCase();
      let hexColor = "#ccc";

      if (colorBase === "azul") {
        hexColor = estudiante.color_pildora1;
      } else if (colorBase === "morado") {
        hexColor = estudiante.color_pildora2;
      } else if (colorBase === "amarillo") {
        hexColor = estudiante.color_pildora3;
      } else {
        hexColor = colorBase || "#ccc";
      }

      if (!materiasMap[n.materia]) {
        materiasMap[n.materia] = {
          color: hexColor,
          docente: `${n.nombre_profe} ${n.apellido_profe}`,
          actividades: [],
          sumaNotas: 0,
          sumaPesos: 0,
        };
        cantidadMaterias++;
      }

      const nota = parseFloat(n.nota) || 0;
      const peso = parseFloat(n.peso) || 0;
      const valorFinal = (nota * peso) / 100;

      materiasMap[n.materia].actividades.push({
        nombre: n.actividad,
        peso,
        nota,
        valorFinal,
      });

      materiasMap[n.materia].sumaNotas += valorFinal;
      materiasMap[n.materia].sumaPesos += peso;
    }

    // Calcular el promedio de cada materia y el promedio general del estudiante
    Object.values(materiasMap).forEach((materia) => {
      const promedioMateria = materia.sumaNotas;
      sumaPromediosMaterias += promedioMateria;
    });

    const promedioEstudiante = (
      sumaPromediosMaterias / cantidadMaterias
    ).toFixed(2);

    // 3. Traer todas las notas de todos los estudiantes del curso y periodo vigente
    const notasCursoQuery = `
      SELECT
        c.id_estudiante,
        m.id_materia,
        c.nota,
        a.peso
      FROM Calificacion c
      JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
      JOIN Materia m ON a.id_materia = m.id_materia AND m.activo = TRUE
      JOIN Estudiante e ON c.id_estudiante = e.documento_identidad
      WHERE e.id_curso = $1
        AND a.id_periodo = $2
        AND c.activo = TRUE
      ORDER BY c.id_estudiante, m.id_materia;
    `;
    const notasCurso = await consultarDB(notasCursoQuery, [
      estudiante.id_curso,
      periodoVigente.id_periodo,
    ]);

    // 4. Procesar para calcular promedios por estudiante y materia
    const estudiantesMap = {};

    for (const nota of notasCurso) {
      if (!estudiantesMap[nota.id_estudiante]) {
        estudiantesMap[nota.id_estudiante] = {
          materias: {},
          sumaPromedios: 0,
          cantidadMaterias: 0,
          promedioFinal: 0,
        };
      }

      const estudianteObj = estudiantesMap[nota.id_estudiante];

      if (!estudianteObj.materias[nota.id_materia]) {
        estudianteObj.materias[nota.id_materia] = {
          sumaNotas: 0,
          sumaPesos: 0,
        };
        estudianteObj.cantidadMaterias++;
      }

      estudianteObj.materias[nota.id_materia].sumaNotas +=
        nota.nota * (nota.peso / 100);
      estudianteObj.materias[nota.id_materia].sumaPesos += nota.peso;
    }

    // 5. Calcular promedio final para cada estudiante
    for (const estudianteId in estudiantesMap) {
      const estudianteObj = estudiantesMap[estudianteId];
      let sumaPromediosMaterias = 0;

      for (const materiaId in estudianteObj.materias) {
        const materia = estudianteObj.materias[materiaId];
        // Aquí podrías validar que sumaPesos sea 100 o cercano a eso si quieres
        sumaPromediosMaterias += materia.sumaNotas; // ya ponderado
      }

      estudianteObj.promedioFinal =
        sumaPromediosMaterias / estudianteObj.cantidadMaterias;
    }

    // 6. Ordenar estudiantes por promedio final descendente para calcular puesto
    const estudiantesOrdenados = Object.entries(estudiantesMap).sort(
      ([, a], [, b]) => b.promedioFinal - a.promedioFinal
    );

    // 7. Obtener el puesto del estudiante buscado
    let puesto = 1;
    for (let i = 0; i < estudiantesOrdenados.length; i++) {
      if (estudiantesOrdenados[i][0] === documento_identidad) {
        puesto = i + 1;
        break;
      }
    }
    // Encabezado personalizado
    const encabezadoHTML = `
      <div class="encabezado">
        <img src="${estudiante.logo}" alt="Logo Institución" style="max-height: 100px; margin-bottom: 10px;" />
        <h1 class="tituloJM" style="background-color: ${estudiante.color_principal}; color: white; font-size: 24px; font-weight: bold; border-radius: 8px; padding: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          Boletín Académico - ${estudiante.institucion}
        </h1>
      </div>
    `;

    const htmlTemplatePath = path.join(
      __dirname,
      "../templates/boletin/boletinTemplate.html"
    );
    let html = fs.readFileSync(htmlTemplatePath, "utf8");

    // Reemplazar datos en el HTML
    html = html.replace("{{ENCABEZADO}}", encabezadoHTML);
    html = html.replace(
      "{{NOMBRE}}",
      `${estudiante.nombre} ${estudiante.apellido}`
    );
    html = html.replace("{{DOCUMENTO}}", estudiante.documento_identidad);
    html = html.replace("{{CURSO}}", estudiante.curso);
    html = html.replace("{{CORREO}}", estudiante.correo);
    html = html.replace("{{COLOR}}", estudiante.color_principal);
    html = html.replace("{{COLOR_SECUNDARIO}}", estudiante.color_secundario);
    html = html.replace("{{FONDO}}", estudiante.fondo);
    html = html.replace("{{PROMEDIO_ESTUDIANTE}}", promedioEstudiante);
    html = html.replace("{{PUESTO}}", puesto);

    // --- Generar el HTML de las materias ---
    let tablasHTML = `
      <div style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 20px;">
        ${periodoVigente.nombre}
      </div>
    `;
    Object.entries(materiasMap).forEach(([nombreMateria, info]) => {
      const headerColor = info.color;
      const softColor = lightenColor(headerColor, 80);

      tablasHTML += `
        <div class="materia-titulo" style="background-color: ${headerColor}; color: white;">
          ${nombreMateria} - ${info.docente}
        </div>
        <table>
          <thead style="background-color: ${softColor};">
            <tr>
              <th>Actividad</th>
              <th>Peso</th>
              <th>Nota</th>
              <th>Valor Final</th>
            </tr>
          </thead>
          <tbody>
      `;

      info.actividades.forEach((act) => {
        tablasHTML += `
          <tr>
            <td>${act.nombre}</td>
            <td>${act.peso}%</td>
            <td>${act.nota.toFixed(2)}</td>
            <td>${act.valorFinal.toFixed(2)}</td>
          </tr>
        `;
      });

      tablasHTML += `
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Promedio de la materia:</td>
            <td style="font-weight: bold;">${info.sumaNotas.toFixed(2)}</td>
          </tr>
        </tbody>
        </table>
      `;
    });

    html = html.replace("{{TABLAS_MATERIAS}}", tablasHTML);

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    throw new Error(`Error generando boletín: ${error.message}`);
  }
};

const generateBoletinFinalPdf = async (documento_identidad) => {
  try {
    const infoQuery = `
      SELECT u.documento_identidad, u.nombre, u.apellido, u.correo, u.id_institucion,
             c.nombre AS curso, c.id_curso,
             i.nombre AS institucion, i.logo, i.color_principal, i.color_secundario, i.fondo,
             i.color_pildora1, i.color_pildora2, i.color_pildora3
      FROM Usuario u
      JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      JOIN Institucion i ON u.id_institucion = i.id_institucion
      WHERE u.documento_identidad = $1 AND u.activo = TRUE;
    `;
    const [estudiante] = await consultarDB(infoQuery, [documento_identidad]);

    if (!estudiante) throw new Error("Estudiante no encontrado o inactivo");

    // Traer todos los periodos de la institución
    const periodosQuery = `
      SELECT id_periodo, nombre, peso
      FROM PeriodoAcademico
      WHERE id_institucion = $1
      ORDER BY anio, fecha_inicio;
    `;
    const periodos = await consultarDB(periodosQuery, [
      estudiante.id_institucion,
    ]);

    // Traer todas las notas del estudiante, agrupadas por periodo
    let tablasHTML = "";

    // Encabezado personalizado
    const encabezadoHTML = `
        <div class="encabezado">
          <img src="${estudiante.logo}" alt="Logo Institución" style="max-height: 100px; margin-bottom: 10px;" />
          <h1 class="tituloJM" style="background-color: ${estudiante.color_principal}; color: white; font-size: 24px; font-weight: bold; border-radius: 8px; padding: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Boletín Académico - ${estudiante.institucion}
          </h1>
        </div>
      `;

    const htmlTemplatePath = path.join(
      __dirname,
      "../templates/boletin/boletinTemplate.html"
    );
    let html = fs.readFileSync(htmlTemplatePath, "utf8");

    // Reemplazar datos en el HTML
    html = html.replace("{{ENCABEZADO}}", encabezadoHTML);
    html = html.replace(
      "{{NOMBRE}}",
      `${estudiante.nombre} ${estudiante.apellido}`
    );
    html = html.replace("{{DOCUMENTO}}", estudiante.documento_identidad);
    html = html.replace("{{CURSO}}", estudiante.curso);
    html = html.replace("{{CORREO}}", estudiante.correo);
    html = html.replace("{{COLOR}}", estudiante.color_principal);
    html = html.replace("{{COLOR_SECUNDARIO}}", estudiante.color_secundario);
    html = html.replace("{{FONDO}}", estudiante.fondo);

    for (const periodo of periodos) {
      const notasQuery = `
        SELECT 
          m.nombre AS materia, 
          m.color,
          a.nombre AS actividad, 
          a.peso,
          c.nota,
          p.documento_identidad AS doc_profe, 
          up.nombre AS nombre_profe, 
          up.apellido AS apellido_profe
        FROM Calificacion c
        INNER JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        INNER JOIN Materia m ON a.id_materia = m.id_materia AND m.activo = TRUE
        INNER JOIN Profesor p ON a.id_docente = p.documento_identidad
        INNER JOIN Usuario up ON p.documento_identidad = up.documento_identidad
        WHERE c.id_estudiante = $1 
          AND c.activo = TRUE
          AND a.id_periodo = $2
        ORDER BY m.nombre, a.nombre;
      `;
      const notas = await consultarDB(notasQuery, [
        documento_identidad,
        periodo.id_periodo,
      ]);

      // Agrupa y calcula igual que en el boletín vigente
      const materiasMap = {};
      for (const n of notas) {
        const colorBase = n.color?.toLowerCase();
        let hexColor = "#ccc";
        if (colorBase === "azul") hexColor = estudiante.color_pildora1;
        else if (colorBase === "morado") hexColor = estudiante.color_pildora2;
        else if (colorBase === "amarillo") hexColor = estudiante.color_pildora3;
        else hexColor = colorBase || "#ccc";

        if (!materiasMap[n.materia]) {
          materiasMap[n.materia] = {
            color: hexColor,
            docente: `${n.nombre_profe} ${n.apellido_profe}`,
            actividades: [],
            sumaNotas: 0,
            sumaPesos: 0,
          };
        }
        const nota = parseFloat(n.nota) || 0;
        const peso = parseFloat(n.peso) || 0;
        const valorFinal = (nota * peso) / 100;
        materiasMap[n.materia].actividades.push({
          nombre: n.actividad,
          peso,
          nota,
          valorFinal,
        });
        materiasMap[n.materia].sumaNotas += valorFinal;
        materiasMap[n.materia].sumaPesos += peso;
      }

      // Calcular promedio general del periodo sumando promedios netos de materias
      let promedioPeriodo = 0;
      for (const materia in materiasMap) {
        promedioPeriodo += materiasMap[materia].sumaNotas;
      }

      // Multiplicar promedioPeriodo por el peso del periodo
      const valorPonderadoPeriodo =
        promedioPeriodo * (parseFloat(periodo.peso) || 0);

      // Genera el HTML para este periodo
      tablasHTML += `
        <div style="text-align: center; font-weight: bold; font-size: 20px; margin: 30px 0 10px 0;">
          ${periodo.nombre}
        </div>
      `;
      Object.entries(materiasMap).forEach(([nombreMateria, info]) => {
        const headerColor = info.color;
        const softColor = lightenColor(headerColor, 80);

        tablasHTML += `
          <div class="materia-titulo" style="background-color: ${headerColor}; color: white;">
            ${nombreMateria} - ${info.docente}
          </div>
          <table>
            <thead style="background-color: ${softColor};">
              <tr>
                <th>Actividad</th>
                <th>Peso</th>
                <th>Nota</th>
                <th>Valor Final</th>
              </tr>
            </thead>
            <tbody>
        `;
        info.actividades.forEach((act) => {
          tablasHTML += `
            <tr>
              <td>${act.nombre}</td>
              <td>${act.peso}%</td>
              <td>${act.nota.toFixed(2)}</td>
              <td>${act.valorFinal.toFixed(2)}</td>
            </tr>
          `;
        });
        tablasHTML += `
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Promedio de la materia:</td>
              <td style="font-weight: bold;">${info.sumaNotas.toFixed(2)}</td>
            </tr>
            </tbody>
          </table>
        `;
      });
    }

    // 1. Traer todos los promedios ponderados de todos los estudiantes del curso
    const promediosQuery = `
      SELECT e.documento_identidad,
        SUM(sub.promedioPeriodo * p.peso ) / SUM(p.peso ) AS promedioFinal
      FROM Estudiante e
      JOIN Usuario u ON e.documento_identidad = u.documento_identidad
      JOIN PeriodoAcademico p ON p.id_institucion = u.id_institucion
      JOIN (
        SELECT c.id_estudiante, a.id_periodo,
              SUM(c.nota * a.peso)  / NULLIF(SUM(a.peso), 0) AS promedioPeriodo
        FROM Calificacion c
        JOIN Actividades a ON c.id_actividad = a.id_actividad AND a.activo = TRUE
        WHERE c.activo = TRUE
        GROUP BY c.id_estudiante, a.id_periodo
      ) sub ON sub.id_estudiante = e.documento_identidad AND sub.id_periodo = p.id_periodo
      WHERE e.id_curso = $1 AND u.id_institucion = $2
      GROUP BY e.documento_identidad
      ORDER BY promedioFinal DESC;
    `;

    const estudiantesPromedios = await consultarDB(promediosQuery, [estudiante.id_curso, estudiante.id_institucion]);

    // 2. Encontrar el promedio definitivo y puesto del estudiante actual
    let promedioDefinitivo = 0;
    let puesto = 0;
    for (let i = 0; i < estudiantesPromedios.length; i++) {
      if (estudiantesPromedios[i].documento_identidad === documento_identidad) {
        promedioDefinitivo = parseFloat(estudiantesPromedios[i].promediofinal).toFixed(2);
        puesto = i + 1;
        break;
      }
    }


    html = html.replace('{{PROMEDIO_ESTUDIANTE}}', promedioDefinitivo);
    html = html.replace('{{PUESTO}}', puesto);
    html = html.replace("{{TABLAS_MATERIAS}}", tablasHTML);

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    throw new Error(`Error generando boletín final: ${error.message}`);
  }
};

module.exports = { generateBoletinPdf, generateBoletinFinalPdf };

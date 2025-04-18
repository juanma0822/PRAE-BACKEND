const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { consultarDB } = require('../db');
require('dotenv').config();

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return (
    '#' +
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
             c.nombre AS curso,
             i.nombre AS institucion, i.logo, i.color_principal, i.color_secundario, i.fondo,
             i.color_pildora1, i.color_pildora2, i.color_pildora3
      FROM Usuario u
      JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
      JOIN Curso c ON e.id_curso = c.id_curso
      JOIN Institucion i ON u.id_institucion = i.id_institucion
      WHERE u.documento_identidad = $1 AND u.activo = TRUE;
    `;
    const [estudiante] = await consultarDB(infoQuery, [documento_identidad]);

    if (!estudiante) throw new Error('Estudiante no encontrado o inactivo');

    const notasQuery = `
      SELECT m.nombre AS materia, m.color,
             a.nombre AS actividad, a.peso,
             c.nota,
             p.documento_identidad AS doc_profe, up.nombre AS nombre_profe, up.apellido AS apellido_profe
      FROM Calificacion c
      JOIN Actividades a ON c.id_actividad = a.id_actividad
      JOIN Materia m ON a.id_materia = m.id_materia
      JOIN Profesor p ON a.id_docente = p.documento_identidad
      JOIN Usuario up ON p.documento_identidad = up.documento_identidad
      WHERE c.id_estudiante = $1 AND c.activo = TRUE AND a.activo = TRUE
      ORDER BY m.nombre, a.nombre;
    `;
    const notas = await consultarDB(notasQuery, [documento_identidad]);

    const htmlTemplatePath = path.join(__dirname, '../templates/boletin/boletinTemplate.html');
    let html = fs.readFileSync(htmlTemplatePath, 'utf8');

    // Encabezado personalizado
    const encabezadoHTML = `
      <div class="encabezado">
        <img src="${estudiante.logo}" alt="Logo Institución" style="max-height: 100px; margin-bottom: 10px;" />
        <h1 class="tituloJM" style="background-color: ${estudiante.color_principal}; color: white; font-size: 24px; font-weight: bold; border-radius: 8px; padding: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          Boletín Académico - ${estudiante.institucion}
        </h1>
      </div>
    `;
    html = html.replace('{{ENCABEZADO}}', encabezadoHTML);

    html = html.replace('{{NOMBRE}}', `${estudiante.nombre} ${estudiante.apellido}`);
    html = html.replace('{{DOCUMENTO}}', estudiante.documento_identidad);
    html = html.replace('{{CURSO}}', estudiante.curso);
    html = html.replace('{{CORREO}}', estudiante.correo);
    html = html.replace('{{COLOR}}', estudiante.color_principal);
    html = html.replace('{{COLOR_SECUNDARIO}}', estudiante.color_secundario);
    html = html.replace('{{FONDO}}', estudiante.fondo);

    const materiasMap = {};
    for (const n of notas) {
      let colorBase = n.color?.toLowerCase();
      let hexColor = '#ccc';

      if (colorBase === 'azul') {
        hexColor = estudiante.color_pildora1;
      } else if (colorBase === 'morado') {
        hexColor = estudiante.color_pildora2;
      } else if (colorBase === 'amarillo') {
        hexColor = estudiante.color_pildora3;
      } else {
        hexColor = colorBase || '#ccc';
      }

      if (!materiasMap[n.materia]) {
        materiasMap[n.materia] = {
          color: hexColor,
          docente: `${n.nombre_profe} ${n.apellido_profe}`,
          actividades: [],
        };
      }

      materiasMap[n.materia].actividades.push({
        nombre: n.actividad,
        peso: n.peso,
        nota: n.nota,
      });
    }

    let tablasHTML = '';
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
        const nota = parseFloat(act.nota) || 0;
        const peso = parseFloat(act.peso) || 0;
        const valorFinal = (nota * peso / 100).toFixed(2);

        tablasHTML += `
          <tr>
            <td>${act.nombre}</td>
            <td>${peso}%</td>
            <td>${nota.toFixed(2)}</td>
            <td>${valorFinal}</td>
          </tr>
        `;
      });

      tablasHTML += `</tbody></table>`;
    });

    html = html.replace('{{TABLAS_MATERIAS}}', tablasHTML);

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    throw new Error(`Error generando boletín: ${error.message}`);
  }
};

module.exports = { generateBoletinPdf };

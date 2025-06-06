const fs = require("fs").promises;
const path = require("path");

async function getNotaTemplate(
  correo = "",
  nombreInstitucion = "PRAE",
  nombreActividad = "",
  nombreMateria = "",
  nota = 0,
  logoInstitucion = "https://firebasestorage.googleapis.com/v0/b/praeweb-a1526.firebasestorage.app/o/logos%2FLOGO-PRAE.png?alt=media&token=8900f817-2353-4bcc-81cf-df9f2b8e90d2"
) {
  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "templates",
    "notaTemplate.html"
  );
  try {
    let html = await fs.readFile(templatePath, "utf-8");
    html = html
      .replace(/{{correoUsuario}}/g, correo)
      .replace(/{{nombreInstitucion}}/g, nombreInstitucion)
      .replace(/{{nombreActividad}}/g, nombreActividad)
      .replace(/{{nombreMateria}}/g, nombreMateria)
      .replace(/{{nota}}/g, nota)
      .replace(/{{logoInstitucion}}/g, logoInstitucion);
    return html;
  } catch (error) {
    console.error("Error leyendo template de calificacion:", error);
    throw error;
  }
}

module.exports = { getNotaTemplate };

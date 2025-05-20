const fs = require('fs').promises;
const path = require('path');

async function getWelcomeTemplate(correo = '', contrasena = '', color_principal = '#157AFE', color_pildora1 = '#157AFE', color_pildora2 = '#4946E2', nombreInstitucion = 'PRAE') {
  const templatePath = path.join(__dirname, '..', 'templates', 'welcomeTemplate.html');
  try {
    let html = await fs.readFile(templatePath, 'utf-8');
    html = html.replace(/{{correoUsuario}}/g, correo)
               .replace(/{{contrasenaUsuario}}/g, contrasena)
               .replace(/{{color_principal}}/g, color_principal)
               .replace(/{{color_pildora1}}/g, color_pildora1)
               .replace(/{{color_pildora2}}/g, color_pildora2)
               .replace(/{{nombreInstitucion}}/g, nombreInstitucion);
    return html;
  } catch (error) {
    console.error('Error leyendo template de bienvenida:', error);
    throw error;
  }
}

module.exports = { getWelcomeTemplate };
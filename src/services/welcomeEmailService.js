const fs = require('fs').promises;
const path = require('path');

async function getWelcomeTemplate(correo = '', contrasena = '') {
  const templatePath = path.join(__dirname, '..', 'templates', 'welcomeTemplate.html');
  try {
    let html = await fs.readFile(templatePath, 'utf-8');
    html = html.replace(/{{correoUsuario}}/g, correo)
               .replace(/{{contrasenaUsuario}}/g, contrasena);
    return html;
  } catch (error) {
    console.error('Error leyendo template de bienvenida:', error);
    throw error;
  }
}

module.exports = { getWelcomeTemplate };
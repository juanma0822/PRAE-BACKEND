const nodemailer = require('nodemailer');
require('dotenv').config(); // Para usar variables de entorno

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu correo (desde .env)
    pass: process.env.EMAIL_PASS  // Contraseña de aplicación (desde .env)
  },
  tls: {
    rejectUnauthorized: false, // Evita problemas con certificados TLS
  },
});

module.exports = transporter;

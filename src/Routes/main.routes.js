const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  const hour = new Date().getHours();
  const isDark = hour >= 18 || hour < 6;

  const backgroundColor = isDark ? '#121212' : '#ffffff';
  const textColor = isDark ? '#f0f0f0' : '#333333';
  const accentColor = '#157AFE';

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>PRAE API</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: ${backgroundColor};
          color: ${textColor};
          margin: 0;
          padding: 0;
          animation: fadeIn 1.2s ease-in-out;
          background-image: url('/LOGO.svg'); /* Asegúrate de este path */
          background-repeat: no-repeat;
          background-position: center;
          background-size: 300px;
          opacity: 0.98;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        header {
          background-color: ${accentColor};
          padding: 20px;
          color: white;
          text-align: center;
        }

        header img {
          height: 60px;
          vertical-align: middle;
          margin-right: 10px;
        }

        .container {
          max-width: 900px;
          margin: auto;
          padding: 30px 20px;
          background-color: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
          border-radius: 12px;
        }

        ul {
          padding-left: 20px;
        }

        li {
          margin-bottom: 10px;
        }

        footer {
          background-color: ${accentColor};
          color: white;
          text-align: center;
          padding: 20px;
          margin-top: 40px;
        }

        .social-links a {
          margin: 0 10px;
          color: white;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .social-links a:hover {
          color: #ffd700;
        }

        @media (max-width: 600px) {
          h1 { font-size: 22px; }
          h2 { font-size: 18px; }
          p, li { font-size: 14px; }
        }
      </style>
    </head>
    <body>
      <header>
        <img src="/logoPRAE.png" alt="Logo PRAE" style="filter: brightness(0) invert(1);" />
        <h1 style="display:inline;"> - Plataforma de Registro Académico Estudiantil</h1>
        <p>Administración eficiente y segura de datos académicos</p>
      </header>

      <div class="container">
        <h2>¿Qué es PRAE?</h2>
        <p>
          PRAE es una plataforma moderna para instituciones educativas, permitiendo gestionar usuarios, cursos, materias y calificaciones con eficiencia y seguridad.
        </p>
        <ul>
          <li>✅ Aiven (Base de datos desplegada)</li>
          <li>✅ Firebase (Almacenamiento de imagenes)</li>
          <li>✅ WebSockets (Actualizaciones en tiempo real)</li>
          <li>✅ Nodemailer (Notificaciones vía email)</li>
          <li>✅ Swagger (Documentación de API)</li>
        </ul>

        <h2>Rutas disponibles:</h2>
        <ul>
          <li>📂 /usuario</li>
          <li>📂 /cursos</li>
          <li>📂 /materias</li>
          <li>📂 /dictar</li>
          <li>📂 /comentarios</li>
          <li>📂 /asignar</li>
          <li>📂 /actividad</li>
          <li>📂 /calificacion</li>
          <li>📂 /auth</li>
          <li>📂 /instituciones</li>
          <li>📂 /upload</li>
          <li>📂 /periodosAcademicos</li>
          <li>📂 /historialGrado</li>
          <li>📂 /estadisticas</li>
          <li>📂 /test</li>
          <li>📂 /api-docs</li>
        </ul>
      </div>

      <footer>
        <p>© 2025 PRAE - Plataforma de Registro Académico Estudiantil</p>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/juan-manuel-valencia-ingenierosistemas/" target="_blank">🔗 LinkedIn</a> |
          <a href="https://github.com/juanma0822" target="_blank">💻 GitHub</a>
        </div>
      </footer>
    </body>
    </html>
  `);
});


module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');

// Servir archivos estáticos desde la carpeta public
router.use(express.static(path.join(__dirname, '../public')));

router.get('/', (req, res) => {
  const hour = new Date().getHours();
  const isDark = hour >= 18 || hour < 6;

  const backgroundColor = isDark ? '#121212' : '#ffffff';
  const textColor = '#333333';
  const accentColor = '#157AFE';
  const highlightColor = '#f1faff';

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>PRAE API</title>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: ${backgroundColor};
          color: ${textColor};
          margin: 0;
          padding: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          animation: fadeIn 1s ease-in;
          opacity: 0.9;
        }
        
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/LOGO.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.5;
          z-index: -1;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: ${accentColor};
          padding: 10px 20px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar img {
          height: 40px;
          filter: brightness(0) invert(1);
        }

        .navbar-links {
          display: flex;
          gap: 20px;
        }

        .navbar a {
          color: white;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
          transition: color 0.3s ease;
        }

        .navbar a:hover {
          color: #ffd700;
        }

        .section {
          padding: 40px 20px;
          max-width: 1000px;
          margin: 40px auto;
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease-in;
        }

        .section h2 {
          color: ${accentColor};
          font-size: 28px;
          margin-bottom: 20px;
        }

        ul li {
          margin-bottom: 10px;
        }

        .card {
          border: 2px solid ${accentColor};
          padding: 20px;
          border-radius: 12px;
          background-color: ${highlightColor};
          max-width: 500px;
          margin: auto;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .card p {
          margin: 10px 0;
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
      </style>
    </head>
    <body>
      <div class="navbar">
        <img src="/logoPRAE.png" alt="Logo PRAE" />
        <div class="navbar-links">
          <a href="#home">🏠 Home</a>
          <a href="#rutas-info">📂 Rutas Info</a>
          <a href="#contactanos">📞 Contáctanos</a>
        </div>
      </div>

      <div id="home" class="section">
        <h2>Home</h2>
        <p>
          Bienvenido a <strong>PRAE</strong> (Plataforma de Registro Académico Estudiantil), una solución digital avanzada
          diseñada para facilitar la administración académica de estudiantes, docentes e instituciones.
        </p>
        <p>
          Nuestra API permite la gestión de cursos, materias, actividades, calificaciones, usuarios,
          periodos académicos, generación de boletines y mucho más, todo en una estructura moderna y escalable.
        </p>
        <p>
          Además, incorporamos WebSockets para estadísticas en tiempo real, generación de PDFs con Puppeteer,
          y un sistema de correos personalizados para mantener la comunicación entre las partes involucradas.
        </p>
      </div>

      <div id="rutas-info" class="section">
        <h2>📂 Rutas Info</h2>
        <p>
          Estas son las rutas disponibles dentro de nuestra API RESTful:
        </p>
        <ul>
          <li>📁 <strong>/usuario:</strong> CRUD completo de usuarios y gestión de roles.</li>
          <li>📁 <strong>/cursos:</strong> Creación, edición y asignación de cursos activos.</li>
          <li>📁 <strong>/materias:</strong> Gestión de materias activas dentro de la institución.</li>
          <li>📁 <strong>/dictar:</strong> Vinculación de profesores con materias.</li>
          <li>📁 <strong>/comentarios:</strong> Comentarios y observaciones entre profesores y estudiantes.</li>
          <li>📁 <strong>/asignar:</strong> Asignación de materias a cursos con validación de estado.</li>
          <li>📁 <strong>/actividad:</strong> Registro de actividades con peso para promedio final.</li>
          <li>📁 <strong>/calificacion:</strong> Registro y modificación de calificaciones.</li>
          <li>📁 <strong>/auth:</strong> Registro, login y recuperación de contraseña con correo.</li>
          <li>📁 <strong>/instituciones:</strong> CRUD de instituciones educativas y configuración visual.</li>
          <li>📁 <strong>/upload:</strong> Subida de logos e imágenes institucionales.</li>
          <li>📁 <strong>/periodosAcademicos:</strong> Control de periodos por año académico.</li>
          <li>📁 <strong>/historialGrado:</strong> Historial académico de cada estudiante por año.</li>
          <li>📁 <strong>/estadisticas:</strong> Métricas académicas en tiempo real (WebSocket).</li>
          <li>📁 <strong>/boletines:</strong> Generación de boletines en PDF por periodo.</li>
          <li>📁 <strong>/test:</strong> Ruta de pruebas técnicas.</li>
          <li>📁 <strong>/api-docs:</strong> Documentación Swagger UI.</li>
        </ul>
      </div>

      <div id="contactanos" class="section">
        <h2>📞 Contáctanos</h2>
        <div class="card">
          <h3 style="color: ${accentColor};">Juan Manuel Valencia</h3>
          <p><strong>Correo:</strong> juanmanuelva3243@gmail.com</p>
          <p><strong>Teléfono:</strong> +57 318 900 4221</p>
          <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/juan-manuel-valencia-ingenierosistemas/" target="_blank">Perfil Profesional</a></p>
        </div>
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

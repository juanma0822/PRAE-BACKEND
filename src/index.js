require('dotenv').config(); 
const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const pool = require('./db');
const testRoute = require('./Routes/testRoute');
const mainRoutes = require('./Routes/main.routes');
const usuarioRoutes = require('./Routes/usuario.routes');
const cursosRoutes = require('./Routes/curso.routes');
const { initializeSocket } = require("./sockets/sockets");
const materiaRoutes = require('./Routes/materia.routes');
const dictarRoutes = require('./Routes/dictar.route');
const comentarioRoutes = require('./Routes/comentario.routes');
const asignarCursoMateriaRoutes = require('./Routes/asignar.routes');
const actividadRoutes = require('./Routes/actividad.routes');
const calificacionRoutes = require('./Routes/calificacion.routes');
const authRoutes = require('./Routes/auth.routes');
const swaggerRoutes = require("./swagger/swagger");
const institucionRoutes = require('./Routes/institucion.routes');
const periodoAcademicoRoutes = require('./Routes/periodoAcademico.routes');
const historialGradoRoutes = require('./Routes/historialGrado.routes');
const uploadRoutes = require('./Routes/upload.routes');
const estadisticasRoutes = require('./Routes/estadisticas.routes');
const path = require('path');


app.use(express.static(path.join(__dirname, '../public')));


//--------------MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/', mainRoutes);
const server = http.createServer(app);

initializeSocket(server);

//-------------ROUTES

//USER ROUTES
app.use('/usuario', usuarioRoutes);

//CURSO ROUTES
app.use('/cursos', cursosRoutes);

// Rutas de Materias
app.use('/materias', materiaRoutes);

// Rutas de Dictar (Profesor - Materia)
app.use('/dictar', dictarRoutes);

// Comments Routes
app.use('/comentarios', comentarioRoutes);

//Asign (Curso - Materia) Route
app.use('/asignar', asignarCursoMateriaRoutes);

// Activity Route
app.use('/actividad', actividadRoutes);

// Calification Route
app.use('/calificacion', calificacionRoutes);

// Auth Route
app.use('/auth', authRoutes);

// Institution Routes
app.use('/instituciones', institucionRoutes);

// Logo Upload Route
app.use('/upload', uploadRoutes);

// Periodo Academico Routes
app.use('/periodosAcademicos', periodoAcademicoRoutes);

// Historial Grado Routes
app.use('/historialGrado', historialGradoRoutes); 

// Estadisticas Routes
app.use('/estadisticas', estadisticasRoutes);

//TEST API
app.use('/test', testRoute);

//Swagger Route
app.use("/api-docs", swaggerRoutes);

// Usar el puerto asignado por Vercel o el puerto 5000 en desarrollo
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
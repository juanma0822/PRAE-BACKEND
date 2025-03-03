const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const pool = require('./db');
const testRoute = require('./Routes/testRoute');
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

//--------------MIDDLEWARE
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = initializeSocket(server);

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

//TEST API
app.use('/test', testRoute);

//Swagger Route
app.use("/api-docs", swaggerRoutes);

// Usar el puerto asignado por Vercel o el puerto 5000 en desarrollo
const PORT = process.env.PORT || 5000;

// Agrega esto antes de iniciar el servidor
app.get('/', (req, res) => {
    res.send('<h1>Bienvenido al API REST de PRAE</h1><p>Este es el index</p>');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
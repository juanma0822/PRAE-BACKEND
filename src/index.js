const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const pool = require('./db');
const testRoute = require('./Routes/testRoute');
const usuarioRoutes = require('./Routes/usuario.routes');
const cursosRoutes = require('./Routes/curso.routes');
const { initializeSocket } = require("./sockets/sockets");
const swaggerUi = require('swagger-ui-express');
const swagger = require('./swagger/swagger');
const materiaRoutes = require('./Routes/materia.routes');
const dictarRoutes = require('./Routes/dictar.route');
const comentarioRoutes = require('./Routes/comentario.routes');
const asignarCursoMateriaRoutes = require('./Routes/asignar.routes');
const actividadRoutes = require('./Routes/actividad.routes');
const calificacionRoutes = require('./Routes/calificacion.routes');


//--------------MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/api-docs', swagger.serve, swagger.setup);
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

//TEST API
app.use('/test', testRoute);

const PORT = process.env.PORT || 5000;

// Agrega esto antes de iniciar el servidor
app.get('/', (req, res) => {
    res.send('<h1>Bienvenido al API REST de PRAE</h1><p>Este es el index</p>');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT || 'default'}`);
});

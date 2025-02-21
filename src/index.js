const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const testRoute = require('./Routes/testRoute');
const usuarioRoutes = require('./Routes/usuario.routes');
const cursosRoutes = require('./Routes/curso.routes');
const materiaRoutes = require('./Routes/materia.routes');
const dictarRoutes = require('./Routes/dictar.route');
const comentarioRoutes = require('./Routes/comentario.routes');
const asignarCursoMateriaRoutes = require('./Routes/asignar.routes');
const actividadRoutes = require('./Routes/actividad.routes');
const calificacionRoutes = require('./Routes/calificacion.routes');

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/cursos', cursosRoutes);
app.use('/materias', materiaRoutes);
app.use('/dictar', dictarRoutes);
app.use('/comentarios', comentarioRoutes);
app.use('/asignar', asignarCursoMateriaRoutes);
app.use('/actividad', actividadRoutes);
app.use('/calificacion', calificacionRoutes);
app.use('/test', testRoute);

// En lugar de app.listen()
module.exports = app;

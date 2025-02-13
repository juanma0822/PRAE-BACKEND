const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const testRoute = require('./Routes/testRoute');
const usuarioRoutes = require('./Routes/usuario.routes');
const cursosRoutes = require('./Routes/curso.routes');


//--------------MIDDLEWARE
app.use(cors());
app.use(express.json());

//-------------ROUTES

//USER ROUTES

app.use('/usuario', usuarioRoutes);

//CURSO ROUTES
app.use('/cursos', cursosRoutes);

//TEST API
app.use('/test', testRoute);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
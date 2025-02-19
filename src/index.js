const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const pool = require('./db');
const testRoute = require('./Routes/testRoute');
const usuarioRoutes = require('./Routes/usuario.routes');
const cursosRoutes = require('./Routes/curso.routes');
const { initializeSocket } = require("./sockets/sockets");

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

//TEST API
app.use('/test', testRoute);

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
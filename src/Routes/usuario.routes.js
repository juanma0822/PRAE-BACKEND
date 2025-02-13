const express = require('express');
const router = express.Router();
const { createAdmin, createProfesor, createEstudiante, getUsuarios, updateUsuario, deleteUsuario, activarUsuario, getAdmins, getDocentes,getEstudiantes } = require('../controllers/usuario.controller');

// Crear usuarios
router.post('/admin', createAdmin);
router.post('/docente', createProfesor);
router.post('/estudiante', createEstudiante);

// Leer usuarios
router.get('/', getUsuarios);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);
router.put('/activar/:documento_identidad', activarUsuario);

// Traer usuarios por el rol
router.get('/admins', getAdmins);
router.get('/docentes', getDocentes);
router.get('/estudiantes', getEstudiantes);

module.exports = router;

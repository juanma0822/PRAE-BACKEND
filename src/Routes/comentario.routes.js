const express = require('express');
const router = express.Router();
const {
  createComentario,
  deleteComentario,
  getAllComentarios,
  getComentariosPorProfesor,
  getComentariosPorEstudiante,
  getComentariosPorProfesorYEstudiante,
} = require('../controllers/comentario.controller');


// Crear un nuevo comentario
router.post('/', createComentario);

// Obtener todos los comentarios
router.get('/', getAllComentarios);

// Eliminar un comentario
router.delete('/:id', deleteComentario);

// Obtener comentarios por profesor
router.get('/profesor/:documento_profe', getComentariosPorProfesor);

// Obtener comentarios por estudiante
router.get('/estudiante/:documento_estudiante', getComentariosPorEstudiante);

// Obtener comentarios por profesor y estudiante
router.get('/profesor/:documento_profe/estudiante/:documento_estudiante', getComentariosPorProfesorYEstudiante);

module.exports = router;
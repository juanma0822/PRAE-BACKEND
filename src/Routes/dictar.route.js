const express = require('express');
const router = express.Router();
const {
  createDictar,
  getAllDictar,
  getMateriasPorProfesor,
  getProfesoresPorMateria,
  deleteDictar,
  updateMateriaProfesor
} = require('../controllers/dictar.controller');

// Crear una relación Dictar
router.post('/', createDictar);

// Obtener todas las relaciones Dictar
router.get('/', getAllDictar);

// Obtener las materias que dicta un profesor
router.get('/profesor/:documento_profe/materias', getMateriasPorProfesor);

// Obtener los profesores que dictan una materia
router.get('/materia/:id_materia/profesores', getProfesoresPorMateria);

// Eliminar una relación Dictar
router.delete('/:id_materiadictada', deleteDictar);

//Ruta para actualizar materia que da un profesor
router.put('/updateMateriaProfesor/:documento_identidad', updateMateriaProfesor);


module.exports = router;
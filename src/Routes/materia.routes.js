const express = require('express');
const router = express.Router();
const {
  addMateria,
  getMateriaById,
  getAllMaterias,
  updateMateria,
  deleteMateria,
  activateMateria,
} = require('../controllers/materia.controller');

// Crear una materia
router.post('/', addMateria);

// Obtener una materia por su ID
router.get('/:id_materia', getMateriaById);

// Obtener todas las materias activas
router.get('/', getAllMaterias);

// Actualizar una materia
router.put('/:id_materia', updateMateria);

// Desactivar una materia
router.delete('/:id_materia', deleteMateria);

// Activar una materia
router.put('/:id_materia/activate', activateMateria);

module.exports = router;
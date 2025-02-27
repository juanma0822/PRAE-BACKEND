const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const {
  addMateria,
  getMateriaById,
  getAllMaterias,
  getMateriasByInstitucion,
  updateMateria,
  deleteMateria,
  activateMateria,
} = require('../controllers/materia.controller');

// Crear una materia
router.post('/', verifyToken, addMateria);

// Obtener una materia por su ID
router.get('/:id_materia', getMateriaById);

// Obtener todas las materias activas
router.get('/', getAllMaterias);

// Obtener todas las materias de una institución específica
router.get('/institucion/:institucion', verifyToken, getMateriasByInstitucion);

// Actualizar una materia
router.put('/:id_materia', verifyToken, updateMateria);

// Desactivar una materia
router.delete('/:id_materia', verifyToken, deleteMateria);

// Activar una materia
router.put('/:id_materia/activate', verifyToken, activateMateria);

module.exports = router;
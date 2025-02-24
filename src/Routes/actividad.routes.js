const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividad.controller');

// Crear una nueva actividad
router.post('/crear', actividadController.crearActividad);

// Obtener todas las actividades de una materia
router.get('/materia/:id_materia', actividadController.obtenerActividadesPorMateria);

// Actualizar una actividad (sin cambiar la materia)
router.put('/actualizar/:id_actividad', actividadController.actualizarActividad);

// Eliminar una actividad
router.delete('/eliminar/:id_actividad', actividadController.eliminarActividad);

module.exports = router;

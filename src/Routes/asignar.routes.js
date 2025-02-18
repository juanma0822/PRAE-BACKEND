const express = require('express');
const router = express.Router();
const { asignarMateria, obtenerMateriasPorCurso, eliminarAsignacion } = require('../controllers/asignar.controller');

router.post('/asignarMateria', asignarMateria);
router.get('/curso/:id_curso', obtenerMateriasPorCurso);
router.delete('/eliminarAsignacion/:id_asignacion', eliminarAsignacion);

module.exports = router;

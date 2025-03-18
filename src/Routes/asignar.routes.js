const express = require('express');
const router = express.Router();
const { asignarMateria, obtenerMateriasPorCurso, eliminarAsignacion, obtenerAsignacionesPorInstitucion, obtenerMateriasPorGrado, obtenerGradosPorProfesor, obtenerAsignacionesPorProfesor } = require('../controllers/asignar.controller');

router.post('/asignarMateria', asignarMateria);
router.get('/curso/:id_curso', obtenerMateriasPorCurso);
router.delete('/eliminarAsignacion/:id_asignacion', eliminarAsignacion);

// Nueva ruta para obtener todas las asignaciones de una institución
router.get('/institucion/:id_institucion', obtenerAsignacionesPorInstitucion);

// Nueva ruta para obtener las materias asignadas a un grado en una institución
router.get('/grado/:id_curso/institucion/:id_institucion', obtenerMateriasPorGrado);

// Nueva ruta para obtener los grados asignados a un profesor
router.get('/profesor/:documento_profe', obtenerGradosPorProfesor);

router.get('/asignaciones/profesor/:documento_profe', obtenerAsignacionesPorProfesor);

module.exports = router;

const express = require('express');
const router = express.Router();
const {getCursos, getCursoById, createCurso, updateCurso, deleteCurso, activateCurso, getIdByName, getEstudiantesPorCurso} = require('../controllers/curso.controller');

router.get('/', getCursos);
router.get('/:id', getCursoById);
router.post('/', createCurso);
router.put('/:id', updateCurso);
router.delete('/:id', deleteCurso);
router.put('/:id/activate', activateCurso);

//Tener el id del curso teniendo el nombre
router.get('/getId/:nombre', getIdByName);

// Ruta para obtener estudiantes por id_curso
router.get('/:id_curso/estudiantes', getEstudiantesPorCurso);

module.exports = router;

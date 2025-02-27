const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware")
const { 
    getCursos, 
    getCursoById, 
    createCurso, 
    updateCurso, 
    deleteCurso, 
    activateCurso, 
    getIdByName, 
    getEstudiantesPorCurso,
    getCursosByInstitucion 
} = require('../controllers/curso.controller');

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Obtiene la lista de cursos
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida correctamente
 */
router.get('/', getCursos);

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Obtiene un curso por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso obtenido correctamente
 */
router.get('/:id', getCursoById);

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Crea un nuevo curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               institucion:
 *                 type: string
 *              color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 */
router.post('/',verifyToken, createCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Actualiza un curso por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               institucion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente
 */
router.put('/:id', updateCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Elimina un curso por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso eliminado correctamente
 */
router.delete('/:id', deleteCurso);

/**
 * @swagger
 * /cursos/{id}/activate:
 *   put:
 *     summary: Activa un curso por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso activado correctamente
 */
router.put('/:id/activate', activateCurso);

/**
 * @swagger
 * /cursos/getId/{nombre}:
 *   get:
 *     summary: Obtiene el ID de un curso a partir de su nombre
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del curso
 *     responses:
 *       200:
 *         description: ID del curso obtenido correctamente
 */
router.get('/getId/:nombre', getIdByName);

/**
 * @swagger
 * /cursos/{id_curso}/estudiantes:
 *   get:
 *     summary: Obtiene la lista de estudiantes de un curso por su ID
 *     parameters:
 *       - in: path
 *         name: id_curso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
 */
router.get('/:id_curso/estudiantes', getEstudiantesPorCurso);

/**
 * @swagger
 * /cursos/institucion:
 *   get:
 *     summary: Obtiene la lista de cursos de una institución específica
 *     parameters:
 *       - in: query
 *         name: institucion
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la institución
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida correctamente
 */
router.get('/institucion/:institucion', verifyToken, getCursosByInstitucion);

module.exports = router;
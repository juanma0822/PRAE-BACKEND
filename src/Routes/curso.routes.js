const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
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
 *     tags: [Cursos - GET]
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
 *     tags: [Cursos - GET]
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
 *     tags: [Cursos - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               id_institucion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 */
router.post('/', verifyToken, createCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Actualiza un curso por su ID
 *     tags: [Cursos - PUT]
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
 *               id_institucion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente
 */
router.put('/:id', verifyToken, updateCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Elimina un curso por su ID
 *     tags: [Cursos - DELETE]
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
router.delete('/:id', verifyToken, deleteCurso);

/**
 * @swagger
 * /cursos/{id}/activate:
 *   put:
 *     summary: Activa un curso por su ID
 *     tags: [Cursos - PUT]
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
router.put('/:id/activate', verifyToken, activateCurso);

/**
 * @swagger
 * /cursos/getId/{nombre}:
 *   get:
 *     summary: Obtiene el ID de un curso a partir de su nombre
 *     tags: [Cursos - GET]
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
 *     tags: [Cursos - GET]
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
router.get('/:id_curso/estudiantes', verifyToken, getEstudiantesPorCurso);

/**
 * @swagger
 * /cursos/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene la lista de cursos de una institución específica
 *     tags: [Cursos - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida correctamente
 */
router.get('/institucion/:id_institucion', verifyToken, getCursosByInstitucion);

module.exports = router;
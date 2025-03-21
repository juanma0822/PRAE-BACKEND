const express = require('express');
const router = express.Router();
const { asignarMateria, obtenerMateriasPorCurso, eliminarAsignacion, obtenerAsignacionesPorInstitucion, obtenerMateriasPorGrado, obtenerGradosPorProfesor, obtenerAsignacionesPorProfesor } = require('../controllers/asignar.controller');
const verifyToken = require("../middleware/auth.middleware");

/**
 * @swagger
 * /asignarMateria:
 *   post:
 *     summary: Asigna una materia a un curso
 *     tags: [Asignaciones - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_curso:
 *                 type: integer
 *                 description: ID del curso
 *               id_materia:
 *                 type: integer
 *                 description: ID de la materia
 *               id_docente:
 *                 type: string
 *                 description: Documento de identidad del docente
 *     responses:
 *       201:
 *         description: Materia asignada con éxito
 *       400:
 *         description: Error en la solicitud (parámetros faltantes o inválidos)
 *       500:
 *         description: Error interno del servidor
 */
router.post('/asignarMateria', verifyToken, asignarMateria);

/**
 * @swagger
 * /curso/{id_curso}:
 *   get:
 *     summary: Obtiene las materias asignadas a un curso
 *     tags: [Asignaciones - GET]
 *     parameters:
 *       - in: path
 *         name: id_curso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_materia:
 *                     type: integer
 *                     description: ID de la materia
 *                   materia:
 *                     type: string
 *                     description: Nombre de la materia
 *                   profesor_documento:
 *                     type: string
 *                     description: Documento de identidad del profesor
 *                   profesor_nombre:
 *                     type: string
 *                     description: Nombre del profesor
 *                   profesor_apellido:
 *                     type: string
 *                     description: Apellido del profesor
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.get('/curso/:id_curso', verifyToken, obtenerMateriasPorCurso);

/**
 * @swagger
 * /eliminarAsignacion/{id_asignacion}:
 *   delete:
 *     summary: Elimina una asignación
 *     tags: [Asignaciones - DELETE]
 *     parameters:
 *       - in: path
 *         name: id_asignacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/eliminarAsignacion/:id_asignacion', eliminarAsignacion);

/**
 * @swagger
 * /institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene todas las asignaciones de una institución
 *     tags: [Asignaciones - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de asignaciones obtenida correctamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.get('/institucion/:id_institucion', obtenerAsignacionesPorInstitucion);

/**
 * @swagger
 * /grado/{id_curso}/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene las materias asignadas a un grado en una institución
 *     tags: [Asignaciones - GET]
 *     parameters:
 *       - in: path
 *         name: id_curso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.get('/grado/:id_curso/institucion/:id_institucion', verifyToken, obtenerMateriasPorGrado);

/**
 * @swagger
 * /profesor/{documento_profe}:
 *   get:
 *     summary: Obtiene los grados asignados a un profesor
 *     tags: [Asignaciones - GET]
 *     parameters:
 *       - in: path
 *         name: documento_profe
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     responses:
 *       200:
 *         description: Lista de grados obtenida correctamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.get('/profesor/:documento_profe', verifyToken, obtenerGradosPorProfesor);

/**
 * @swagger
 * /asignaciones/profesor/{documento_profe}/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene todas las asignaciones de un profesor en una institución específica
 *     tags: [Asignaciones - GET]
 *     parameters:
 *       - in: path
 *         name: documento_profe
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de asignaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_asignacion:
 *                     type: integer
 *                     description: ID de la asignación
 *                   id_curso:
 *                     type: integer
 *                     description: ID del curso
 *                   curso:
 *                     type: string
 *                     description: Nombre del curso
 *                   id_materia:
 *                     type: integer
 *                     description: ID de la materia
 *                   materia:
 *                     type: string
 *                     description: Nombre de la materia
 *                   profesor_documento:
 *                     type: string
 *                     description: Documento de identidad del profesor
 *                   profesor_nombre:
 *                     type: string
 *                     description: Nombre del profesor
 *                   profesor_apellido:
 *                     type: string
 *                     description: Apellido del profesor
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.get('/asignaciones/profesor/:documento_profe/institucion/:id_institucion', verifyToken, obtenerAsignacionesPorProfesor);

module.exports = router;

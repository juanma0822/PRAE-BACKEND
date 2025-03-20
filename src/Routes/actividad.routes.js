const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividad.controller');

/**
 * @swagger
 * /actividades/crear:
 *   post:
 *     summary: Crea una nueva actividad
 *     tags: [Actividades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la actividad
 *               peso:
 *                 type: integer
 *                 description: Peso de la actividad
 *               id_materia:
 *                 type: integer
 *                 description: ID de la materia
 *               id_docente:
 *                 type: string
 *                 description: Documento de identidad del docente
 *     responses:
 *       201:
 *         description: Actividad creada exitosamente
 */
router.post('/crear', actividadController.crearActividad);

/**
 * @swagger
 * /actividades/materia/{id_materia}:
 *   get:
 *     summary: Obtiene todas las actividades de una materia
 *     tags: [Actividades]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Lista de actividades obtenida correctamente
 */
router.get('/materia/:id_materia', actividadController.obtenerActividadesPorMateria);

/**
 * @swagger
 * /actividades/institucion/{id_institucion}/docente/{id_docente}/materia/{id_materia}:
 *   get:
 *     summary: Obtiene todas las actividades de una materia específica creadas por un docente en una institución
 *     tags: [Actividades]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *       - in: path
 *         name: id_docente
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del docente
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Lista de actividades obtenida correctamente
 */
router.get('/institucion/:id_institucion/docente/:id_docente/materia/:id_materia', actividadController.obtenerActividadesPorMateriaDocenteInstitucion);

/**
 * @swagger
 * /actividades/actualizar/{id_actividad}:
 *   put:
 *     summary: Actualiza una actividad
 *     tags: [Actividades]
 *     parameters:
 *       - in: path
 *         name: id_actividad
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la actividad
 *               peso:
 *                 type: integer
 *                 description: Peso de la actividad
 *               id_docente:
 *                 type: string
 *                 description: Documento de identidad del docente
 *     responses:
 *       200:
 *         description: Actividad actualizada correctamente
 */
router.put('/actualizar/:id_actividad', actividadController.actualizarActividad);

/**
 * @swagger
 * /actividades/eliminar/{id_actividad}:
 *   delete:
 *     summary: Elimina una actividad
 *     tags: [Actividades]
 *     parameters:
 *       - in: path
 *         name: id_actividad
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Actividad eliminada correctamente
 */
router.delete('/eliminar/:id_actividad', actividadController.eliminarActividad);

module.exports = router;
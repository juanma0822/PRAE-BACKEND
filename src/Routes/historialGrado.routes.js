const express = require('express');
const router = express.Router();
const {
  createHistorialGrado,
  getAllHistorialesGrado,
  getHistorialGradoByEstudianteAnio,
  getHistorialesGradoByInstitucion,
  getHistorialCompletoByEstudiante,
  updateHistorialGrado,
  deleteHistorialGrado,
} = require('../controllers/historialGrado.controller');

/**
 * @swagger
 * /historialGrado:
 *   post:
 *     summary: Crear un nuevo historial de grado
 *     tags: [Historial de Grado - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_estudiante:
 *                 type: string
 *               id_curso:
 *                 type: integer
 *               id_periodo:
 *                 type: integer
 *               anio:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Historial de grado creado exitosamente
 */
router.post('/', createHistorialGrado);

/**
 * @swagger
 * /historialGrado:
 *   get:
 *     summary: Obtener todos los historiales de grado activos
 *     tags: [Historial de Grado - GET]
 *     responses:
 *       200:
 *         description: Lista de historiales de grado obtenida correctamente
 */
router.get('/', getAllHistorialesGrado);

/**
 * @swagger
 * /historialGrado/estudiante/anio:
 *   get:
 *     summary: Obtener el historial de grado de un estudiante por año
 *     tags: [Historial de Grado - GET]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_estudiante:
 *                 type: string
 *               anio:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Historial de grado obtenido correctamente
 */
router.get('/estudiante/anio', getHistorialGradoByEstudianteAnio);

/**
 * @swagger
 * /historialGrado/institucion/{id_institucion}:
 *   get:
 *     summary: Obtener todos los historiales de grado de una institución específica
 *     tags: [Historial de Grado - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de historiales de grado obtenida correctamente
 */
router.get('/institucion/:id_institucion', getHistorialesGradoByInstitucion);

/**
 * @swagger
 * /historialGrado/estudiante/{id_estudiante}:
 *   get:
 *     summary: Obtener el historial completo de un estudiante
 *     tags: [Historial de Grado - GET]
 *     parameters:
 *       - in: path
 *         name: id_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Historial completo del estudiante obtenido correctamente
 */
router.get('/estudiante/:id_estudiante', getHistorialCompletoByEstudiante);

/**
 * @swagger
 * /historialGrado/{id_historial}:
 *   put:
 *     summary: Actualizar un historial de grado
 *     tags: [Historial de Grado - PUT]
 *     parameters:
 *       - in: path
 *         name: id_historial
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial de grado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_estudiante:
 *                 type: string
 *               id_curso:
 *                 type: integer
 *               id_periodo:
 *                 type: integer
 *               anio:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Historial de grado actualizado correctamente
 */
router.put('/:id_historial', updateHistorialGrado);

/**
 * @swagger
 * /historialGrado/{id_historial}:
 *   delete:
 *     summary: Desactivar un historial de grado (cambiar estado a false)
 *     tags: [Historial de Grado - DELETE]
 *     parameters:
 *       - in: path
 *         name: id_historial
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial de grado
 *     responses:
 *       200:
 *         description: Historial de grado desactivado correctamente
 */
router.delete('/:id_historial', deleteHistorialGrado);

module.exports = router;
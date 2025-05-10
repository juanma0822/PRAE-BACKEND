const express = require('express');
const router = express.Router();
const {
  getEstadisticasAdmin,
  getEstadisticasProfesor,
  getEstadisticasEstudiante,
} = require('../controllers/estadisticas.controller');
const verifyToken = require("../middleware/auth.middleware");

/**
 * @swagger
 * /estadisticas/admin/{id_institucion}:
 *   get:
 *     summary: Obtiene estadísticas para el administrador de una institución
 *     tags: [Estadísticas - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/admin/:id_institucion', verifyToken, getEstadisticasAdmin);

/**
 * @swagger
 * /estadisticas/profesor/{documento_profe}:
 *   get:
 *     summary: Obtiene estadísticas para un profesor
 *     tags: [Estadísticas - GET]
 *     parameters:
 *       - in: path
 *         name: documento_profe
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/profesor/:documento_profe', verifyToken, getEstadisticasProfesor);

/**
 * @swagger
 * /estadisticas/estudiante/{documento_estudiante}:
 *   get:
 *     summary: Obtiene estadísticas para un estudiante
 *     tags: [Estadísticas - GET]
 *     parameters:
 *       - in: path
 *         name: documento_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estudiante/:documento_estudiante', verifyToken, getEstadisticasEstudiante);

module.exports = router;
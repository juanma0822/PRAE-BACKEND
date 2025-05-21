const express = require('express');
const router = express.Router();
const boletinController = require('../controllers/boletin.controller');
const verifyToken = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

/**
 * @swagger
 * /boletines/final:
 *   get:
 *     summary: Genera y devuelve el boletín académico final del usuario autenticado en PDF
 *     description: Retorna un archivo PDF con el boletín final del usuario autenticado (todas las materias y periodos).
 *     tags:
 *       - Boletín
 *     produces:
 *       - application/pdf
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al generar el boletín final
 */
router.get('/final', verifyToken, boletinController.getBoletinFinalPdf);

/**
 * @swagger
 * /boletines/{documento_identidad}:
 *   get:
 *     summary: (Admin) Genera y devuelve el boletín académico de un estudiante en PDF
 *     description: Solo administradores. Retorna un archivo PDF con el boletín del estudiante especificado por documento de identidad.
 *     tags:
 *       - Boletín
 *     produces:
 *       - application/pdf
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token inválido o expirado
 *       403:
 *         description: "Acceso denegado: No tienes permisos de administrador"
 *       500:
 *         description: Error al generar el boletín
 */
router.get('/:documento_identidad', verifyToken, adminMiddleware, boletinController.getBoletinPdfEstudiante);

/**
 * @swagger
 * /boletines:
 *   get:
 *     summary: Genera y devuelve el boletín académico del usuario autenticado en PDF
 *     description: Retorna un archivo PDF con el boletín del usuario autenticado (estudiante).
 *     tags:
 *       - Boletín
 *     produces:
 *       - application/pdf
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al generar el boletín
 */
router.get('/', verifyToken, boletinController.getBoletinPdf);

module.exports = router;

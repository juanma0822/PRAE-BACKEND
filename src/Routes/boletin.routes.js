const express = require('express');
const router = express.Router();
const boletinController = require('../controllers/boletin.controller');

/**
 * @swagger
 * /boletines/{documento_identidad}:
 *   get:
 *     summary: Genera y devuelve el boletín académico del estudiante en PDF
 *     description: Retorna un archivo PDF con el boletín del estudiante especificado por documento de identidad.
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
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error al generar el boletín
 */
router.get('/:documento_identidad', boletinController.getBoletinPdf);

module.exports = router;

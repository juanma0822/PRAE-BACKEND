const express = require('express');
const router = express.Router();
const { recoverPassword, validateResetToken, VerifyLogin, validateToken } = require("../controllers/rutas.controller");
const verifyRecoveryToken = require('../middleware/recover.middleware');


/**
 * @swagger
 * /auth/Login:
 *   post:
 *     summary: Realiza la verificación de login del usuario
 *     tags: [Auth - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario (no requerido en modo demo)
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (no requerida en modo demo)
 *               demo:
 *                 type: boolean
 *                 description: Indica si es un login en modo demo
 *               rol:
 *                 type: string
 *                 description: Rol del usuario en modo demo (admin, profesor, estudiante)
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve un token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito
 *                 token:
 *                   type: string
 *                   description: Token JWT generado
 *       400:
 *         description: Error en la petición (faltan datos o rol inválido).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error
 *                 detalle:
 *                   type: string
 *                   description: Detalle del error
 *       401:
 *         description: Credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error
 */
router.post('/Login', VerifyLogin);

/**
 * @swagger
 * /auth/recoverPassword:
 *   post:
 *     summary: Inicia el proceso de recuperación de contraseña
 *     tags: [Auth - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proceso de recuperación iniciado.
 */
router.post('/recoverPassword', recoverPassword);

/**
 * @swagger
 * /auth/validate/{token}:
 *   get:
 *     summary: Valida el token de reinicio de contraseña
 *     tags: [Auth - GET]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token para validar el reinicio.
 *     responses:
 *       200:
 *         description: Token válido.
 */
router.get('/validate/:token', validateToken);

/**
 * @swagger
 * /auth/validateResetToken:
 *   get:
 *     summary: Valida el token de recuperación de contraseña
 *     tags: [Auth - GET]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *                 id:
 *                   type: string
 *                 rol:
 *                   type: string
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Token no válido para recuperación.
 */
router.get('/validateResetToken', verifyRecoveryToken, validateResetToken);


module.exports = router;
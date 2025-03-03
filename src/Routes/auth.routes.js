const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/register.controller');
const { recoverPassword, validateResetToken, VerifyLogin } = require("../controllers/rutascontroller");

/**
 * @swagger
 * /auth/addRegister:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente.
 */
router.post('/addRegister', getUser);

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
 *               password:
 *                 type: string
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
 *                 token:
 *                   type: string
 *       400:
 *         description: Error en la petición (faltan datos).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
router.get('/validate/:token', validateResetToken);

module.exports = router;
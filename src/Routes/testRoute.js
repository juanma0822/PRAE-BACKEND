const express = require('express');
const pool = require('../db'); 
const router = express.Router();
const { getUser } = require('../controllers/register.controller');
const { recoverPassword, validateResetToken, VerifyLogin, sendMessage, getChatHistory, generatePdf,NotesBySubject } = require("./rutascontroller");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica que la API esté funcionando
 *     responses:
 *       200:
 *         description: Respuesta de confirmación.
 */
router.get('/', (req, res) => {
    res.send('API is working!');
});

/**
 * @swagger
 * /test/addRegister:
 *   post:
 *     summary: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              
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
 * /test/Login:
 *   post:
 *     summary: Realiza la verificación de login del usuario
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
 * /test/chat:
 *   post:
 *     summary: Envía un mensaje de chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender_id:
 *                 type: integer
 *               receiver_id:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensaje enviado.
 */
router.post('/chat', sendMessage);

/**
 * @swagger
 * /test/chat/{sender_id}/{receiver_id}:
 *   get:
 *     summary: Obtiene el historial de chat entre dos usuarios
 *     parameters:
 *       - in: path
 *         name: sender_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del remitente.
 *       - in: path
 *         name: receiver_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del receptor.
 *     responses:
 *       200:
 *         description: Historial de chat obtenido.
 */
router.get("/chat/:sender_id/:receiver_id", getChatHistory);

/**
 * @swagger
 * /test/recoverPassword:
 *   post:
 *     summary: Inicia el proceso de recuperación de contraseña
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
 * /test/generate-pdf/{title}:
 *   post:
 *     summary: Genera un PDF a partir de un título
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Título para el PDF.
 *     responses:
 *       200:
 *         description: PDF generado correctamente.
 */
router.post('/generate-pdf/:title', generatePdf);

/**
 * @swagger
 * /test/validate/{token}:
 *   get:
 *     summary: Valida el token de reinicio de contraseña
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


/**
 * @swagger
 * /test/materia/{id}:
 *   get:
 *     summary: Obtener notas por materia y curso
 *     description: Retorna las notas de un estudiante en una materia y curso específicos.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificación del estudiante.
 *         schema:
 *           type: string
 *       - name: subject
 *         in: query
 *         required: true
 *         description: Nombre de la materia.
 *         schema:
 *           type: string
 *       - name: curse
 *         in: query
 *         required: true
 *         description: Nombre del curso.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos obtenidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_estudiante:
 *                     type: string
 *                     example: "123456"
 *                   nombre:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   curso:
 *                     type: string
 *                     example: "Matemáticas"
 *                   materia:
 *                     type: string
 *                     example: "Álgebra"
 *                   calificacion:
 *                     type: number
 *                     example: 8.5
 *       400:
 *         description: Parámetros faltantes o incorrectos.
 *       404:
 *         description: No se encontraron datos.
 *       500:
 *         description: Error en el servidor.
 */


router.get('/materia/:id',NotesBySubject)

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createComentario,
  deleteComentario,
  getAllComentarios,
  getComentariosPorProfesor,
  getComentariosPorEstudiante,
  getComentariosPorProfesorYEstudiante,
  updateComentario,
} = require('../controllers/comentario.controller');
const verifyToken = require("../middleware/auth.middleware");

/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comentarios - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *               documento_profe:
 *                 type: string
 *               documento_estudiante:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 */
router.post('/', verifyToken, createComentario);

/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comentarios - GET]
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
 */
router.get('/', verifyToken, getAllComentarios);

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Comentarios - DELETE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado correctamente
 */
router.delete('/:id', verifyToken, deleteComentario);

/**
 * @swagger
 * /comentarios/profesor/{documento_profe}:
 *   get:
 *     summary: Obtener comentarios por profesor
 *     tags: [Comentarios - GET]
 *     parameters:
 *       - in: path
 *         name: documento_profe
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
 */
router.get('/profesor/:documento_profe', verifyToken,getComentariosPorProfesor);

/**
 * @swagger
 * /comentarios/estudiante/{documento_estudiante}:
 *   get:
 *     summary: Obtener comentarios por estudiante
 *     tags: [Comentarios - GET]
 *     parameters:
 *       - in: path
 *         name: documento_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
 */
router.get('/estudiante/:documento_estudiante', verifyToken, getComentariosPorEstudiante);

/**
 * @swagger
 * /comentarios/profesor/{documento_profe}/estudiante/{documento_estudiante}:
 *   get:
 *     summary: Obtener comentarios por profesor y estudiante
 *     tags: [Comentarios - GET]
 *     parameters:
 *       - in: path
 *         name: documento_profe
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *       - in: path
 *         name: documento_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
 */
router.get('/profesor/:documento_profe/estudiante/:documento_estudiante', verifyToken, getComentariosPorProfesorYEstudiante);

/**
 * @swagger
 * /comentarios/{id}:
 *   put:
 *     summary: Actualizar un comentario existente
 *     tags: [Comentarios - PUT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 */
router.put('/:id', verifyToken, updateComentario);

module.exports = router;
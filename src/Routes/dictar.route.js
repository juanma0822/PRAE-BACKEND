const express = require('express');
const router = express.Router();
const {
  createDictar,
  getAllDictar,
  getMateriasPorProfesor,
  getProfesoresPorMateria,
  deleteDictar,
  updateMateriaProfesor
} = require('../controllers/dictar.controller');
const verifyToken = require("../middleware/auth.middleware");

/**
 * @swagger
 * /dictar:
 *   post:
 *     summary: Crear una relación Dictar
 *     tags: [Dictar materias - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento_profe:
 *                 type: string
 *               id_materia:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relación Dictar creada exitosamente
 */
router.post('/', verifyToken, createDictar);

/**
 * @swagger
 * /dictar:
 *   get:
 *     summary: Obtener todas las relaciones Dictar
 *     tags: [Dictar materias - GET]
 *     responses:
 *       200:
 *         description: Lista de relaciones Dictar obtenida correctamente
 */
router.get('/', getAllDictar);

/**
 * @swagger
 * /dictar/profesor/{documento_profe}/materias:
 *   get:
 *     summary: Obtener las materias que dicta un profesor
 *     tags: [Dictar materias - GET]
 *     parameters:
 *       - in: path
 *         name: documento_profe
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 */
router.get('/profesor/:documento_profe/materias', getMateriasPorProfesor);

/**
 * @swagger
 * /dictar/materia/{id_materia}/profesores:
 *   get:
 *     summary: Obtener los profesores que dictan una materia
 *     tags: [Dictar materias - GET]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Lista de profesores obtenida correctamente
 */
router.get('/materia/:id_materia/profesores', verifyToken, getProfesoresPorMateria);

/**
 * @swagger
 * /dictar:
 *   delete:
 *     summary: Eliminar una relación Dictar (cambiar estado a false)
 *     tags: [Dictar materias - DELETE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento_profe:
 *                 type: string
 *               id_materia:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relación Dictar eliminada correctamente
 */
router.delete('/', deleteDictar);

/**
 * @swagger
 * /dictar/updateMateriaProfesor/{documento_identidad}:
 *   put:
 *     summary: Actualizar materia que dicta un profesor
 *     tags: [Dictar materias - PUT]
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_materia:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Materia actualizada con éxito
 */
router.put('/updateMateriaProfesor/:documento_identidad', verifyToken, updateMateriaProfesor);

module.exports = router;
const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const {
  addMateria,
  getMateriaById,
  getAllMaterias,
  getMateriasByInstitucion,
  updateMateria,
  deleteMateria,
  activateMateria,
} = require('../controllers/materia.controller');

/**
 * @swagger
 * /materias:
 *   post:
 *     summary: Crea una nueva materia
 *     tags: [Materias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               institucion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Materia creada exitosamente
 */
router.post('/', verifyToken, addMateria);

/**
 * @swagger
 * /materias/{id_materia}:
 *   get:
 *     summary: Obtiene una materia por su ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Materia obtenida correctamente
 */
router.get('/:id_materia', getMateriaById);

/**
 * @swagger
 * /materias:
 *   get:
 *     summary: Obtiene todas las materias activas
 *     tags: [Materias]
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 */
router.get('/', getAllMaterias);

/**
 * @swagger
 * /materias/institucion/{institucion}:
 *   get:
 *     summary: Obtiene todas las materias de una institución específica
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: institucion
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la institución
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 */
router.get('/institucion/:institucion', verifyToken, getMateriasByInstitucion);

/**
 * @swagger
 * /materias/{id_materia}:
 *   put:
 *     summary: Actualiza una materia
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               institucion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Materia actualizada correctamente
 */
router.put('/:id_materia', verifyToken, updateMateria);

/**
 * @swagger
 * /materias/{id_materia}:
 *   delete:
 *     summary: Desactiva una materia
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Materia desactivada correctamente
 */
router.delete('/:id_materia', verifyToken, deleteMateria);

/**
 * @swagger
 * /materias/{id_materia}/activate:
 *   put:
 *     summary: Activa una materia
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Materia activada correctamente
 */
router.put('/:id_materia/activate', verifyToken, activateMateria);

module.exports = router;
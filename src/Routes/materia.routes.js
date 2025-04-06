const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const {
  addMateria,
  getMateriaById,
  getAllMaterias,
  getMateriasByInstitucion,
  getMateriasConDocentes,
  updateMateria,
  deleteMateria,
  activateMateria,
  getCantidadMateriasPorEstudiante,
} = require('../controllers/materia.controller');

/**
 * @swagger
 * /materias:
 *   post:
 *     summary: Crea una nueva materia
 *     tags: [Materias - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               id_institucion:
 *                 type: integer
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
 *     tags: [Materias - GET]
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
 *     tags: [Materias - GET]
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 */
router.get('/', getAllMaterias);

/**
 * @swagger
 * /materias/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene todas las materias de una institución específica
 *     tags: [Materias - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 */
router.get('/institucion/:id_institucion', verifyToken, getMateriasByInstitucion);

/**
 * @swagger
 * /materias/institucion/{id_institucion}/docentes:
 *   get:
 *     summary: Obtiene todas las materias de una institución con los docentes que las dictan
 *     tags: [Materias - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de materias con docentes obtenida correctamente
 */
router.get('/institucion/:id_institucion/docentes', verifyToken, getMateriasConDocentes);

/**
 * @swagger
 * /materias/{id_materia}:
 *   put:
 *     summary: Actualiza una materia
 *     tags: [Materias - PUT]
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
 *               id_institucion:
 *                 type: integer
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
 *     tags: [Materias - DELETE]
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
 *     tags: [Materias - PUT]
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

/**
 * @swagger
 * /materias/estudiante/{id_estudiante}/cantidad:
 *   get:
 *     summary: Obtiene la cantidad de materias de un estudiante
 *     tags: [Materias - GET]
 *     parameters:
 *       - in: path
 *         name: id_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     responses:
 *       200:
 *         description: Cantidad de materias obtenida correctamente
 */
router.get('/estudiante/:id_estudiante/cantidad', verifyToken, getCantidadMateriasPorEstudiante);


module.exports = router;
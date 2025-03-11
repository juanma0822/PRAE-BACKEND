const express = require('express');
const router = express.Router();
const {
  createPeriodoAcademico,
  getAllPeriodosAcademicos,
  getPeriodoAcademicoById,
  getPeriodosAcademicosByInstitucion,
  getPeriodosAcademicosByAnioEInstitucion,
  updatePeriodoAcademico,
  deletePeriodoAcademico,
} = require('../controllers/periodoAcademico.controller');

/**
 * @swagger
 * /periodos:
 *   post:
 *     summary: Crear un nuevo periodo académico
 *     tags: [Periodos Académicos - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               anio:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               peso:
 *                 type: number
 *               id_institucion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Periodo académico creado exitosamente
 */
router.post('/', createPeriodoAcademico);

/**
 * @swagger
 * /periodos:
 *   get:
 *     summary: Obtener todos los periodos académicos activos
 *     tags: [Periodos Académicos - GET]
 *     responses:
 *       200:
 *         description: Lista de periodos académicos obtenida correctamente
 */
router.get('/', getAllPeriodosAcademicos);

/**
 * @swagger
 * /periodos/{id_periodo}:
 *   get:
 *     summary: Obtener un periodo académico por su ID
 *     tags: [Periodos Académicos - GET]
 *     parameters:
 *       - in: path
 *         name: id_periodo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del periodo académico
 *     responses:
 *       200:
 *         description: Periodo académico obtenido correctamente
 */
router.get('/:id_periodo', getPeriodoAcademicoById);

/**
 * @swagger
 * /periodos/institucion/{id_institucion}:
 *   get:
 *     summary: Obtener periodos académicos por institución
 *     tags: [Periodos Académicos - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de periodos académicos obtenida correctamente
 */
router.get('/institucion/:id_institucion', getPeriodosAcademicosByInstitucion);

/**
 * @swagger
 * /periodos/anio-institucion:
 *   post:
 *     summary: Obtener periodos académicos por año e institución
 *     tags: [Periodos Académicos - get]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               anio:
 *                 type: integer
 *               id_institucion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lista de periodos académicos obtenida correctamente
 */
router.get('/year-institucion', getPeriodosAcademicosByAnioEInstitucion);

/**
 * @swagger
 * /periodos/{id_periodo}:
 *   put:
 *     summary: Actualizar un periodo académico
 *     tags: [Periodos Académicos - PUT]
 *     parameters:
 *       - in: path
 *         name: id_periodo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del periodo académico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               anio:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               peso:
 *                 type: number
 *               id_institucion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Periodo académico actualizado correctamente
 */
router.put('/:id_periodo', updatePeriodoAcademico);

/**
 * @swagger
 * /periodos/{id_periodo}:
 *   delete:
 *     summary: Desactivar un periodo académico (cambiar estado a false)
 *     tags: [Periodos Académicos - DELETE]
 *     parameters:
 *       - in: path
 *         name: id_periodo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del periodo académico
 *     responses:
 *       200:
 *         description: Periodo académico desactivado correctamente
 */
router.delete('/:id_periodo', deletePeriodoAcademico);

module.exports = router;
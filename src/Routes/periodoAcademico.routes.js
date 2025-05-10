const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const {
  createPeriodoAcademico,
  getAllPeriodosAcademicos,
  getPeriodoAcademicoById,
  getPeriodosAcademicosByInstitucion,
  getPeriodosAcademicosByAnioEInstitucion,
  updatePeriodoAcademico,
  deletePeriodoAcademico,
  getPeriodoActivoByInstitucion,
  activatePeriodoAcademico,
} = require('../controllers/periodoAcademico.controller');


/**
 * @swagger
 * /periodos/activo:
 *   get:
 *     summary: Obtener el periodo activo de una institución
 *     tags: [Periodos Académicos - GET]
 *     responses:
 *       200:
 *         description: Periodo activo obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_periodo:
 *                   type: integer
 *                   description: ID del periodo activo
 *                 nombre:
 *                   type: string
 *                   description: Nombre del periodo activo
 *                 anio:
 *                   type: integer
 *                   description: Año del periodo activo
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                   description: Fecha de inicio del periodo activo
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *                   description: Fecha de fin del periodo activo
 *                 peso:
 *                   type: number
 *                   description: Peso del periodo activo
 *                 id_institucion:
 *                   type: integer
 *                   description: ID de la institución asociada
 *                 estado:
 *                   type: boolean
 *                   description: Estado del periodo (activo o inactivo)
 *       401:
 *         description: Acceso denegado, token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 */
router.get('/activo', verifyToken, getPeriodoActivoByInstitucion);

/**
 * @swagger
 * /periodos/{id}/estado:
 *   patch:
 *     summary: Activar un periodo académico y desactivar los demás de la institución
 *     tags: [Periodos Académicos - PATCH]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del periodo académico a activar
 *     responses:
 *       200:
 *         description: Periodo académico activado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_periodo:
 *                   type: integer
 *                   description: ID del periodo activado
 *                 nombre:
 *                   type: string
 *                   description: Nombre del periodo activado
 *                 anio:
 *                   type: integer
 *                   description: Año del periodo activado
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                   description: Fecha de inicio del periodo activado
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *                   description: Fecha de fin del periodo activado
 *                 peso:
 *                   type: number
 *                   description: Peso del periodo activado
 *                 id_institucion:
 *                   type: integer
 *                   description: ID de la institución asociada
 *                 estado:
 *                   type: boolean
 *                   description: Estado del periodo (activo o inactivo)
 *       401:
 *         description: Acceso denegado, token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Periodo académico no encontrado
 */
router.patch('/:id/estado', verifyToken, activatePeriodoAcademico);

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
router.post('/', verifyToken, createPeriodoAcademico);

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
router.get('/', verifyToken, getAllPeriodosAcademicos);

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
router.get('/:id_periodo', verifyToken, getPeriodoAcademicoById);

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
router.get('/institucion/:id_institucion', verifyToken, getPeriodosAcademicosByInstitucion);

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
router.get('/year-institucion', verifyToken, getPeriodosAcademicosByAnioEInstitucion);

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
router.put('/:id_periodo', verifyToken, updatePeriodoAcademico);

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
router.delete('/:id_periodo', verifyToken, deletePeriodoAcademico);

module.exports = router;
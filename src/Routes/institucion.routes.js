const express = require('express');
const router = express.Router();
const {
  createInstitucion,
  getAllInstituciones,
  getInstitucionById,
  updateInstitucion,
  deleteInstitucion,
  activateInstitucion,
} = require('../controllers/institucion.controller');
const { upload } = require('../services/uploadService');
const verifyToken = require('../middleware/auth.middleware')

/**
 * @swagger
 * /instituciones:
 *   post:
 *     summary: Crear una nueva institución
 *     tags: [Instituciones - POST]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               color_principal:
 *                 type: string
 *               color_secundario:
 *                 type: string
 *               fondo:
 *                 type: string
 *               color_pildora1:
 *                 type: string
 *               color_pildora2:
 *                 type: string
 *               color_pildora3:
 *                 type: string
 *     responses:
 *       201:
 *         description: Institución creada exitosamente
 */
router.post('/', verifyToken, upload.single('logo'), createInstitucion);

/**
 * @swagger
 * /instituciones:
 *   get:
 *     summary: Obtener todas las instituciones activas
 *     tags: [Instituciones - GET]
 *     responses:
 *       200:
 *         description: Lista de instituciones obtenida correctamente
 */
router.get('/', getAllInstituciones);

/**
 * @swagger
 * /instituciones/{id_institucion}:
 *   get:
 *     summary: Obtener una institución por su ID
 *     tags: [Instituciones - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Institución obtenida correctamente
 */
router.get('/:id_institucion', verifyToken, getInstitucionById);

/**
 * @swagger
 * /instituciones/{id_institucion}:
 *   put:
 *     summary: Actualizar una institución
 *     tags: [Instituciones - PUT]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento_identidad:
 *                 type: string
 *                 description: Documento de identidad del administrador
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               direccion:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               color_principal:
 *                 type: string
 *               color_secundario:
 *                 type: string
 *               fondo:
 *                 type: string
 *               color_pildora1:
 *                 type: string
 *               color_pildora2:
 *                 type: string
 *               color_pildora3:
 *                 type: string
 *     responses:
 *       200:
 *         description: Institución actualizada correctamente
 */
router.put('/:id_institucion', verifyToken, upload.single('logo'), updateInstitucion);

/**
 * @swagger
 * /instituciones/{id_institucion}:
 *   delete:
 *     summary: Desactivar una institución (cambiar estado a false)
 *     tags: [Instituciones - DELETE]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Institución desactivada correctamente
 */
router.delete('/:id_institucion', verifyToken, deleteInstitucion);

/**
 * @swagger
 * /instituciones/activate/{id_institucion}:
 *   put:
 *     summary: Activar una institución (cambiar estado a true)
 *     tags: [Instituciones - PUT]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Institución activada correctamente
 */
router.put('/activate/:id_institucion', verifyToken, activateInstitucion);

module.exports = router;
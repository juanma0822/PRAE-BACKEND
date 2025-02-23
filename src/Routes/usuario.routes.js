const express = require('express');
const router = express.Router();
const { 
    createAdmin, 
    createProfesor, 
    createEstudiante, 
    getUsuarios, 
    updateUsuario, 
    deleteUsuario, 
    activarUsuario, 
    getAdmins, 
    getDocentes, 
    getEstudiantes 
} = require('../controllers/usuario.controller');

/**
 * @swagger
 * /usuarios/admin:
 *   post:
 *     summary: Crea un nuevo administrador
 *     responses:
 *       201:
 *         description: Administrador creado exitosamente
 */
router.post('/admin', createAdmin);

/**
 * @swagger
 * /usuarios/docente:
 *   post:
 *     summary: Crea un nuevo docente
 *     responses:
 *       201:
 *         description: Docente creado exitosamente
 */
router.post('/docente', createProfesor);

/**
 * @swagger
 * /usuarios/estudiante:
 *   post:
 *     summary: Crea un nuevo estudiante
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente
 */
router.post('/estudiante', createEstudiante);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 */
router.get('/', getUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 */
router.put('/:id', updateUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
router.delete('/:id', deleteUsuario);

/**
 * @swagger
 * /usuarios/activar/{documento_identidad}:
 *   put:
 *     summary: Activa un usuario por su documento de identidad
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del usuario
 *     responses:
 *       200:
 *         description: Usuario activado correctamente
 */
router.put('/activar/:documento_identidad', activarUsuario);

/**
 * @swagger
 * /usuarios/admins:
 *   get:
 *     summary: Obtiene la lista de administradores
 *     responses:
 *       200:
 *         description: Lista de administradores obtenida correctamente
 */
router.get('/admins', getAdmins);

/**
 * @swagger
 * /usuarios/docentes:
 *   get:
 *     summary: Obtiene la lista de docentes
 *     responses:
 *       200:
 *         description: Lista de docentes obtenida correctamente
 */
router.get('/docentes', getDocentes);

/**
 * @swagger
 * /usuarios/estudiantes:
 *   get:
 *     summary: Obtiene la lista de estudiantes
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
 */
router.get('/estudiantes', getEstudiantes);

module.exports = router;

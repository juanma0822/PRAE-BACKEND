const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware")
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
    getEstudiantes,
    updateEstudiante,
    updateProfesor,
    getEstudiantesPorInstitucion,
    getEstudiantesPorProfesor,
    getProfesorById,
    getEstudianteById
} = require("../controllers/usuario.controller");

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
router.get('/', verifyToken, getUsuarios);

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
router.put('/:id', verifyToken, updateUsuario);

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
router.delete('/:id', verifyToken, deleteUsuario);

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
router.put('/activar/:documento_identidad', verifyToken, activarUsuario);

/**
 * @swagger
 * /usuarios/admins:
 *   get:
 *     summary: Obtiene la lista de administradores
 *     responses:
 *       200:
 *         description: Lista de administradores obtenida correctamente
 */
router.get('/admins', verifyToken, getAdmins);

/**
 * @swagger
 * /usuarios/docentes:
 *   get:
 *     summary: Obtiene la lista de docentes
 *     responses:
 *       200:
 *         description: Lista de docentes obtenida correctamente
 */
router.get('/docentes', verifyToken, getDocentes);

/**
 * @swagger
 * /usuarios/estudiantes:
 *   get:
 *     summary: Obtiene la lista de estudiantes
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
 */
router.get('/estudiantes', verifyToken, getEstudiantes);

/**
 * @swagger
 * /usuarios/updateProfesor/{documento_identidad}:
 *   put:
 *     summary: Actualiza los datos de un profesor
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     responses:
 *       200:
 *         description: Profesor actualizado correctamente
 */
router.put("/updateProfesor/:documento_identidad", verifyToken, updateProfesor);

/**
 * @swagger
 * /usuarios/updateEstudiante/{documento_identidad}:
 *   put:
 *     summary: Actualiza los datos de un estudiante
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     responses:
 *       200:
 *         description: Estudiante actualizado correctamente
 */
router.put("/updateEstudiante/:documento_identidad", verifyToken, updateEstudiante);

/**
 * @swagger
 * /usuarios/institucion/{institucion}:
 *   get:
 *     summary: Obtiene los estudiantes de una institución
 *     parameters:
 *       - in: path
 *         name: institucion
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la institución
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
 */
router.get('/institucion/:institucion', verifyToken, getEstudiantesPorInstitucion);

/**
 * @swagger
 * /usuarios/profesor/{documento_profe}/estudiantes:
 *   get:
 *     summary: Obtiene los estudiantes asociados a un profesor
 *     parameters:
 *       - in: path
 *         name: documento_profe
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
 */
router.get('/profesor/:documento_profe/estudiantes', verifyToken, getEstudiantesPorProfesor);

/**
 * @swagger
 * /usuarios/profesor/{id}:
 *   get:
 *     summary: Obtiene un profesor por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesor
 *     responses:
 *       200:
 *         description: Profesor obtenido correctamente
 */
router.get('/profesor/:id', verifyToken, getProfesorById);

/**
 * @swagger
 * /usuarios/estudiante/{id}:
 *   get:
 *     summary: Obtiene un estudiante por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Estudiante obtenido correctamente
 */
router.get('/estudiante/:id', verifyToken, getEstudianteById);

module.exports = router;

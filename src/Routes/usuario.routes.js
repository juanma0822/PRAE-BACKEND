const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
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
    getEstudianteById,
    getDocentesPorInstitucion,
} = require("../controllers/usuario.controller");

/**
 * @swagger
 * /usuarios/admin:
 *   post:
 *     summary: Crea un nuevo administrador
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento_identidad:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               institucion:
 *                 type: string
 *               area_ensenanza:
 *                 type: string
 *     responses:
 *       201:
 *         description: Docente creado exitosamente
 */
router.post('/docente', verifyToken, createProfesor);

/**
 * @swagger
 * /usuarios/estudiante:
 *   post:
 *     summary: Crea un nuevo estudiante
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento_identidad:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               institucion:
 *                 type: string
 *               id_curso:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente
 */
router.post('/estudiante', verifyToken, createEstudiante);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               rol:
 *                 type: string
 *               institucion:
 *                 type: string
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               institucion:
 *                 type: string
 *               area_ensenanza:
 *                 type: string
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
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               institucion:
 *                 type: string
 *               id_curso:
 *                 type: integer
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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
 *     tags: [Usuarios]
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

/**
 * @swagger
 * /usuarios/docentes/institucion/{institucion}:
 *   get:
 *     summary: Obtiene los docentes de una institución
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: institucion
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la institución
 *     responses:
 *       200:
 *         description: Lista de docentes obtenida correctamente
 */
router.get('/docentes/institucion/:institucion', verifyToken, getDocentesPorInstitucion);

module.exports = router;
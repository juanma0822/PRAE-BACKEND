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
    updateAdmin,
    updateEstudiante,
    updateProfesor,
    getEstudiantesPorInstitucion,
    getEstudiantesPorProfesor,
    getProfesorById,
    getEstudianteById,
    getDocentesPorInstitucion,
    updatePassword,
} = require("../controllers/usuario.controller");

/**
 * @swagger
 * /usuarios/admin:
 *   post:
 *     summary: Crea un nuevo administrador
 *     tags: [Usuarios - POST]
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
 *               id_institucion:
 *                 type: integer
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
 *     tags: [Usuarios - POST]
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
 *               id_institucion:
 *                 type: integer
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
 *     tags: [Usuarios - POST]
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
 *               id_institucion:
 *                 type: integer
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
 *     tags: [Usuarios - GET]
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
 *     tags: [Usuarios - PUT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del usuario
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
 *               id_institucion:
 *                 type: integer
 *               contraseña:
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
 *     tags: [Usuarios - DELETE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del usuario
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
 *     tags: [Usuarios - PUT]
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
 *     tags: [Usuarios - GET]
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
 *     tags: [Usuarios - GET]
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
 *     tags: [Usuarios - GET]
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
 */
router.get('/estudiantes', verifyToken, getEstudiantes);

/**
 * @swagger
 * /usuarios/updateAdmin/{documento_identidad}:
 *   put:
 *     summary: Actualiza los datos de un administrador
 *     tags: [Usuarios - PUT]
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del administrador
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
 *               id_institucion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Administrador actualizado correctamente
 */
router.put("/updateAdmin/:documento_identidad", verifyToken, updateAdmin);

/**
 * @swagger
 * /usuarios/updateProfesor/{documento_identidad}:
 *   put:
 *     summary: Actualiza los datos de un profesor
 *     tags: [Usuarios - PUT]
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
 *               id_institucion:
 *                 type: integer
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
 *     tags: [Usuarios - PUT]
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
 *               id_institucion:
 *                 type: integer
 *               id_curso:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Estudiante actualizado correctamente
 */
router.put("/updateEstudiante/:documento_identidad", verifyToken, updateEstudiante);

/**
 * @swagger
 * /usuarios/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene los estudiantes de una institución
 *     tags: [Usuarios - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
 */
router.get('/institucion/:id_institucion', verifyToken, getEstudiantesPorInstitucion);

/**
 * @swagger
 * /usuarios/profesor/{documento_profe}/estudiantes:
 *   get:
 *     summary: Obtiene los estudiantes asociados a los cursos de un profesor
 *     tags: [Usuarios - GET]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_curso:
 *                     type: integer
 *                     description: ID del curso
 *                   curso_nombre:
 *                     type: string
 *                     description: Nombre del curso
 *                   color:
 *                     type: string
 *                     description: Color asociado al curso
 *                   estudiantes:
 *                     type: array
 *                     description: Lista de estudiantes en el curso
 *                     items:
 *                       type: object
 *                       properties:
 *                         documento_identidad:
 *                           type: string
 *                           description: Documento de identidad del estudiante
 *                         nombre:
 *                           type: string
 *                           description: Nombre del estudiante
 *                         apellido:
 *                           type: string
 *                           description: Apellido del estudiante
 *                         correo:
 *                           type: string
 *                           description: Correo del estudiante
 *                         activo:
 *                           type: boolean
 *                           description: Estado del estudiante (activo o inactivo)
 *       400:
 *         description: Error en la solicitud (parámetro faltante o inválido)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/profesor/:documento_profe/estudiantes', verifyToken, getEstudiantesPorProfesor);

/**
 * @swagger
 * /usuarios/profesor/{id}:
 *   get:
 *     summary: Obtiene un profesor por su ID
 *     tags: [Usuarios - GET]
 *     parameters:
 *       - in: path
 *         name: documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del profesor
 *     responses:
 *       200:
 *         description: Profesor obtenido correctamente
 */
router.get('/profesor/:documento_identidad', verifyToken, getProfesorById);

/**
 * @swagger
 * /usuarios/estudiante/{id}:
 *   get:
 *     summary: Obtiene un estudiante por su ID
 *     tags: [Usuarios - GET]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *     responses:
 *       200:
 *         description: Estudiante obtenido correctamente
 */
router.get('/estudiante/:id', verifyToken, getEstudianteById);

/**
 * @swagger
 * /usuarios/docentes/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene los docentes de una institución
 *     tags: [Usuarios - GET]
 *     parameters:
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de docentes obtenida correctamente
 */
router.get('/docentes/institucion/:id_institucion', verifyToken, getDocentesPorInstitucion);

/**
/**
 * @swagger
 * /usuarios/updatePassword:
 *   put:
 *     summary: Actualiza la contraseña de un usuario
 *     tags: [Usuarios - PUT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevaContraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Error en la solicitud (parámetro faltante o inválido)
 *       500:
 *         description: Error interno del servidor
 */
router.put('/updatePassword', verifyToken, updatePassword);

module.exports = router;
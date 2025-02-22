const express = require("express");
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
  getEstudiantes,
  updateEstudiante,
  updateProfesor,
  getEstudiantesPorInstitucion,
  getEstudiantesPorProfesor,
  getProfesorById,
  getEstudianteById,
} = require("../controllers/usuario.controller");

// Crear usuarios
router.post("/admin", createAdmin);
router.post("/docente", createProfesor);
router.post("/estudiante", createEstudiante);

// Leer usuarios
router.get("/", getUsuarios);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
router.put("/activar/:documento_identidad", activarUsuario);

// Traer usuarios por el rol
router.get("/admins", getAdmins);
router.get("/docentes", getDocentes);
router.get("/estudiantes", getEstudiantes);

// Ruta para actualizar un profesor
router.put("/updateProfesor/:documento_identidad", updateProfesor);

// Ruta para actualizar un estudiante
router.put("/updateEstudiante/:documento_identidad", updateEstudiante);

// Ruta para obtener estudiantes por institución
router.get('/institucion/:institucion', getEstudiantesPorInstitucion);

// Ruta para obtener estudiantes por profesor
router.get('/profesor/:documento_profe/estudiantes', getEstudiantesPorProfesor);

// Ruta para obtener un profesor por su ID
router.get('/profesor/:id', getProfesorById);

// Ruta para obtener un estudiante por su ID
router.get('/estudiante/:id', getEstudianteById);

module.exports = router;

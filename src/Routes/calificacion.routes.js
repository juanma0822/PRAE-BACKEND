const express = require("express");
const router = express.Router();
const {
  asignarCalificacion,
  actualizarCalificacion,
  obtenerCalificacionesEstudiante,
  obtenerCalificacionesEstudiantePorDocenteEInstitucion,
  obtenerCalificacionesCurso,
  obtenerPromedioEstudiante,
  obtenerPromedioCurso,
} = require("../controllers/calificacion.controller");

// Asignar una calificación a un estudiante en una actividad
router.post("/asignar", asignarCalificacion);

// Actualizar una calificación
router.put("/actualizar/:id_calificacion", actualizarCalificacion);

// Obtener todas las calificaciones de un estudiante en una materia
router.get(
  "/materia/:id_materia/estudiante/:id_estudiante",
  obtenerCalificacionesEstudiante
);

/**
 * @swagger
 * /calificaciones/materia/{id_materia}/estudiante/{id_estudiante}/docente/{id_docente}/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene todas las calificaciones de un estudiante en una materia específica impartida por un docente en una institución
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *       - in: path
 *         name: id_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del estudiante
 *       - in: path
 *         name: id_docente
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del docente
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de calificaciones obtenida correctamente
 */
router.get(
  "/materia/:id_materia/estudiante/:id_estudiante/docente/:id_docente/institucion/:id_institucion",
  obtenerCalificacionesEstudiantePorDocenteEInstitucion
);

/**
 * @swagger
 * /calificaciones/materia/{id_materia}/curso/{id_curso}/docente/{id_docente}/institucion/{id_institucion}:
 *   get:
 *     summary: Obtiene todas las calificaciones de un curso en una materia específica impartida por un docente en una institución
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: path
 *         name: id_materia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *       - in: path
 *         name: id_curso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *       - in: path
 *         name: id_docente
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del docente
 *       - in: path
 *         name: id_institucion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Lista de calificaciones obtenida correctamente
 */
router.get(
  '/materia/:id_materia/curso/:id_curso/docente/:id_docente/institucion/:id_institucion',
  obtenerCalificacionesCurso
);

// Obtener el promedio de un estudiante en una materia específica impartida por un docente
router.get(
  "/promedio/materia/:id_materia/estudiante/:id_estudiante/docente/:id_docente",
  obtenerPromedioEstudiante
);

// Obtener el promedio de todos los estudiantes de un curso en una materia
router.get(
  "/promedio/materia/:id_materia/curso/:id_curso",
  obtenerPromedioCurso
);

module.exports = router;

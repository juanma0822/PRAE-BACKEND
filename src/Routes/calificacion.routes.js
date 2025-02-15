const express = require("express");
const router = express.Router();
const {
  asignarCalificacion,
  actualizarCalificacion,
  obtenerCalificacionesEstudiante,
  obtenerCalificacionesCurso,
  obtenerPromedioEstudiante,
  obtenerPromedioCurso,
} = require("../controllers/calificacion.controller");

// Asignar una calificación a un estudiante en una actividad
router.post("/asignar", asignarCalificacion);

// Actualizar una calificación
router.put(
  "/actualizar/:id_calificacion", actualizarCalificacion
);

// Obtener todas las calificaciones de un estudiante en una materia
router.get(
  "/materia/:id_materia/estudiante/:id_estudiante", obtenerCalificacionesEstudiante
);

// Obtener todas las calificaciones de todos los estudiantes de un curso en una materia
router.get(
  "/materia/:id_materia/curso/:id_curso", obtenerCalificacionesCurso
);

// Obtener el promedio de un estudiante en una materia
router.get(
  "/promedio/materia/:id_materia/estudiante/:id_estudiante", obtenerPromedioEstudiante
);

// Obtener el promedio de todos los estudiantes de un curso en una materia
router.get(
  "/promedio/materia/:id_materia/curso/:id_curso", obtenerPromedioCurso
);

module.exports = router;

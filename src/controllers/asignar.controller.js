const asignarService = require("../services/asignar.service");

const asignarMateria = async (req, res) => {
  try {
    const { id_curso, id_materia, id_docente } = req.body;

    if (!id_curso || !id_materia || !id_docente) {
      return res.status(400).json({ message: "Todos los campos son requeridos: id_curso, id_materia, id_docente" });
    }

    const nuevaAsignacion = await asignarService.asignarMateria(id_curso, id_materia, id_docente);
    res.status(201).json({ message: "Materia asignada con éxito", asignacion: nuevaAsignacion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerMateriasPorCurso = async (req, res) => {
  try {
    const { id_curso } = req.params;
    const resultado = await asignarService.obtenerMateriasPorCurso(id_curso);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener materias por curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const eliminarAsignacion = async (req, res) => {
  try {
    const { id_asignacion } = req.params;
    await asignarService.eliminarAsignacion(id_asignacion);
    res.status(200).json({ message: "Asignación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar asignación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerAsignacionesPorInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const resultado = await asignarService.obtenerAsignacionesPorInstitucion(
      id_institucion
    );
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener asignaciones por institución:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerMateriasPorGrado = async (req, res) => {
  try {
    const { id_curso, id_institucion } = req.params;
    const resultado = await asignarService.obtenerMateriasPorGrado(
      id_curso,
      id_institucion
    );
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener materias por grado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerGradosPorProfesor = async (req, res) => {
  try {
    const { documento_profe } = req.params;
    const resultado = await asignarService.obtenerGradosPorProfesor(
      documento_profe
    );
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener grados por profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerAsignacionesPorProfesor = async (req, res) => {
    try {
      const { documento_profe } = req.params;
      const resultado = await asignarService.obtenerAsignacionesPorProfesor(documento_profe);
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Error al obtener asignaciones por profesor:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

module.exports = {
  asignarMateria,
  obtenerMateriasPorCurso,
  eliminarAsignacion,
  obtenerAsignacionesPorInstitucion,
  obtenerMateriasPorGrado,
  obtenerGradosPorProfesor,
  obtenerAsignacionesPorProfesor,
};

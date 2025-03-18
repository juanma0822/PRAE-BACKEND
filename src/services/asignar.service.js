const asignarModel = require("../models/asignar.model");

const asignarMateria = async (id_curso, id_materia, id_docente) => {
  try {
    return await asignarModel.asignarMateria(id_curso, id_materia, id_docente);
  } catch (error) {
    throw new Error(`Error al asignar la materia: ${error.message}`);
  }
};

module.exports = {
  ...,
  asignarMateria,
};

const obtenerMateriasPorCurso = async (id_curso) => {
  return await asignarModel.obtenerMateriasPorCurso(id_curso);
};

const eliminarAsignacion = async (id_asignacion) => {
  return await asignarModel.eliminarAsignacion(id_asignacion);
};

const obtenerAsignacionesPorInstitucion = async (id_institucion) => {
  return await asignarModel.obtenerAsignacionesPorInstitucion(id_institucion);
};

const obtenerMateriasPorGrado = async (id_curso, id_institucion) => {
  return await asignarModel.obtenerMateriasPorGrado(id_curso, id_institucion);
};

const obtenerGradosPorProfesor = async (documento_profe) => {
  return await asignarModel.obtenerGradosPorProfesor(documento_profe);
};

const obtenerAsignacionesPorProfesor = async (documento_profe) => {
    return await asignarModel.obtenerAsignacionesPorProfesor(documento_profe);
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

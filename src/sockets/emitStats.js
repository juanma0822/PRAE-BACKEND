const { getIo } = require("./sockets");
const estadisticasService = require("../services/estadisticas.service");

// Emitir estadísticas a una institución
const emitirEstadisticasInstitucion = async (id_institucion) => {
  try {
    const estadisticas = await estadisticasService.getEstadisticasAdmin(id_institucion);
    const io = getIo();
    io.to(`institucion_${id_institucion}`).emit("emitStats", {
      tipo: "institucion",
      identificador: id_institucion,
      estadisticas
    });
  } catch (error) {
    console.error("Error al emitir estadísticas de institución:", error);
  }
};

// Emitir estadísticas a un docente
const emitirEstadisticasProfesor = async (documento_profe) => {
  try {
    const estadisticas = await estadisticasService.getEstadisticasProfesor(documento_profe);
    const io = getIo();
    io.to(`profesor_${documento_profe}`).emit("emitStats", {
      tipo: "profesor",
      identificador: documento_profe,
      estadisticas
    });
  } catch (error) {
    console.error("Error al emitir estadísticas del docente:", error);
  }
};

// Emitir estadísticas a un estudiante
const emitirEstadisticasEstudiante = async (documento_estudiante) => {
  try {
    const estadisticas = await estadisticasService.getEstadisticasEstudiante(documento_estudiante);
    const io = getIo();
    io.to(`estudiante_${documento_estudiante}`).emit("emitStats", {
      tipo: "estudiante",
      identificador: documento_estudiante,
      estadisticas
    });
  } catch (error) {
    console.error("Error al emitir estadísticas del estudiante:", error);
  }
};

module.exports = {
  emitirEstadisticasInstitucion,
  emitirEstadisticasProfesor,
  emitirEstadisticasEstudiante
};

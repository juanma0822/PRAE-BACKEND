const { getIo } = require("./sockets");

/**
 * Emitir un evento de cambio en la institución
 * @param {number} id_institucion - ID de la institución
 */
const emitirCambioInstitucion = (id_institucion) => {
  try {
    const io = getIo();
    io.to(`institucion_${id_institucion}`).emit("emitChanges", {
      message: "Hubo un cambio en la institución",
      id_institucion,
    });
    console.log(`Evento emitChanges enviado a institucion_${id_institucion}`);
  } catch (error) {
    console.error("Error al emitir el evento de cambio en la institución:", error);
  }
};

module.exports = { emitirCambioInstitucion };
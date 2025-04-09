const { Server } = require("socket.io");
const estadisticasService = require("../services/estadisticas.service");

let io; // Declarar la variable io globalmente

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Cambia esto al dominio de tu frontend
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
    pingTimeout: 20000,
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    // Evento para unirse a una sala específica
    socket.on("join", async (roomId) => {
      socket.join(roomId);
      console.log(`Usuario ${socket.id} unido a la sala ${roomId}`);

      const [tipo, identificador] = roomId.split("_"); // tipo = institucion|profesor|estudiante

      try {
        let estadisticas = null;

        if (tipo === "institucion") {
          estadisticas = await estadisticasService.getEstadisticasAdmin(identificador);
        } else if (tipo === "profesor") {
          estadisticas = await estadisticasService.getEstadisticasProfesor(identificador);
        } else if (tipo === "estudiante") {
          estadisticas = await estadisticasService.getEstadisticasEstudiante(identificador);
        }

        if (estadisticas) {
          // Emitir todas las estadísticas bajo el mismo evento
          socket.emit("emitStats", {
            tipo,
            identificador,
            estadisticas
          });
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    });

    socket.on("testMessage", (data) => {
      console.log("Mensaje recibido del cliente:", data);
      socket.emit("nuevaCalificacion", { message: "Mensaje recibido correctamente" });
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io no está inicializado");
  }
  return io;
};

module.exports = { initializeSocket, getIo };

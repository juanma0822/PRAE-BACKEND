const { Server } = require("socket.io");
const materiaService = require("../services/materia.service"); // Importar el servicio de materias

let io; // Declarar la variable io globalmente

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Cambia esto al dominio de tu frontend
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    // Evento para unirse a una sala específica
    socket.on("join", async (roomId) => {
      socket.join(roomId);
      console.log(`Usuario ${socket.id} unido a la sala ${roomId}`);

      // Obtener el ID de la institución desde el roomId (ejemplo: "institucion_1")
      const id_institucion = roomId.split("_")[1];

      if (id_institucion) {
        try {
          // Obtener la cantidad actualizada de materias en la institución
          const cantidadMaterias = await materiaService.getCantidadMateriasPorInstitucion(id_institucion);

          // Emitir el evento al cliente que se unió
          socket.emit("cantidadMateriasInstitucion", { id_institucion, cantidadMaterias });
        } catch (error) {
          console.error("Error al obtener la cantidad de materias:", error);
        }
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
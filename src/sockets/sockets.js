const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Reemplázalo con la URL de tu frontend en producción si es necesario
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`Usuario ${socket.id} unido a la sala ${roomId}`);
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

module.exports = { initializeSocket };

const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://praeweb.netlify.app", // Permitir solo el dominio del frontend
      methods: ["GET", "POST"],
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

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io no está inicializado");
  }
  return io;
};

module.exports = { initializeSocket, getIo };

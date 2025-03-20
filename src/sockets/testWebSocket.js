const { io } = require("socket.io-client");

// Conéctate al servidor WebSocket
const socket = io("http://localhost:5000"); // Cambia la URL si tu servidor está en otro lugar

// Escuchar cuando el cliente se conecta
socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket con ID:", socket.id);

  // Unirse a una sala específica
  const roomId = "12345678"; // ID del estudiante o sala
  socket.emit("join", roomId);
  console.log(`Unido a la sala: ${roomId}`);

  // Enviar un mensaje de prueba al servidor
  socket.emit("testMessage", { message: "Hola desde el cliente WebSocket" });
});

// Escuchar eventos del servidor
socket.on("nuevaCalificacion", (data) => {
  console.log("Nueva calificación recibida:", data);
});

socket.on("actualizarCalificaciones", (data) => {
  console.log("Calificaciones actualizadas:", data);
});

// Escuchar cuando el cliente se desconecta
socket.on("disconnect", () => {
  console.log("Desconectado del servidor WebSocket");
});
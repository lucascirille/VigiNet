import io from 'socket.io-client';

const socket = io("http://localhost:3000", {
  transports: ['websocket', 'polling']
});

socket.on("connect", () => {
  console.log("Conectado al servidor");

  // Emitir el evento para unirse a un vecindario específico
  const vecindarioId = "vecindario123"; // Este es el ID del vecindario (puedes hacerlo dinámico según la lógica de tu app)
  socket.emit('unirseAlVecindario', vecindarioId);
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});

socket.on("connect_error", (error) => {
  console.log("Error de conexión:", error);
});

// Escuchar las alarmas para el vecindario en el que el usuario está
socket.on("nuevaAlarma", (alarma) => {
  console.log("Nueva alarma recibida:", alarma);
  // Aquí puedes manejar cómo mostrar la notificación o procesar la alarma
});

export default socket;

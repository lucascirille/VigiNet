import io from 'socket.io-client';

const socket = io("http://localhost:3001", {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true
});

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("connect_error", (error) => {
  console.error("Error de conexión:", error);
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});

export default socket;
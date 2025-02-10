// frontend/utils/socket.js
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export const connectSocket = (userId, vecindarioId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("identificarUsuario", { userId, vecindarioId });
  }
};

socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket");
});

socket.on("connect_error", (error) => {
  console.error("Error de conexión:", error);
});

export default socket;

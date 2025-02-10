import io from "socket.io-client";

// Conectar al servidor de socket
const socket = io("http://localhost:3000");

// Obtener el vecindario del usuario desde localStorage
const vecindarioId = localStorage.getItem("vecindarioId");
if (vecindarioId) {
  socket.emit("unirseAlVecindario", vecindarioId);
}

export default socket;

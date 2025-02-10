import io from "socket.io-client";

// Conéctate a tu servidor de socket
const socket = io("http://localhost:3000");

// Aquí puedes manejar la autenticación y asignar el vecindario
socket.emit("setNeighborhood", "vecindarioID");

export default socket;

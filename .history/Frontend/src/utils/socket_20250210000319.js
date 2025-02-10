import io from 'socket.io-client';

const socket = io("http://localhost:3000", {
    transports: ['websocket', 'polling']
  });
  
  socket.on("connect", () => {
    console.log("Conectado al servidor");
  });
  
  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
  });
  
  socket.on("connect_error", (error) => {
    console.log("Error de conexión:", error);
  });
  
export default socket;
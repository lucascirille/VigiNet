import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling']
});

export const connectSocket = (userId, vecindarioId) => {
  if (!socket.connected) {
    socket.connect();
    
    // Identificar al usuario
    socket.emit('identificarUsuario', userId);
    
    // Unirse al vecindario
    if (vecindarioId) {
      socket.emit('unirseAlVecindario', `vecindario_${vecindarioId}`);
    }
  }
};

// Agregar listeners para debugging
socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.IO');
});

socket.on('nuevaAlarma', (data) => {
  console.log('Nueva alarma recibida:', data);
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión:', error);
});

export default socket;
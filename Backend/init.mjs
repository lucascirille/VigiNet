import http from 'http';
import app from './src/app.mjs';
import { Server } from 'socket.io';  // Cambié la importación aquí

const server = http.createServer(app);  // Crear un servidor HTTP usando Express
const io = new Server(server);  // Usar new Server en lugar de socketIo

const connectedClients = new Map(); // Usamos un Map para almacenar clientes

io.on('connection', (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.id}`);

  // Agregar usuario al Map
  connectedClients.set(socket.id, { id: socket.id });

  // Notificar a todos los clientes sobre la actualización
  io.emit('update-clients', Array.from(connectedClients.values()));

  socket.on('unirseAlVecindario', (message) => {
    console.log(`📩 Mensaje recibido: ${message}`);




    socket.join(message);


    const rooms = Array.from(socket.rooms);
    console.log("aaa", rooms);
  });

  socket.on('enviarNotificacion', ({ sala, mensaje }) => {
    console.log(`📢 Enviando notificación a la sala ${sala}: ${mensaje}`);
    io.to(sala).emit('notificacion', mensaje);
  });


  socket.on("nuevaAlarma", (message) => {
    console.log(`📩 Mensaje recibido: ${message}`);
    socket.join(message);
  }
  );


  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);
    connectedClients.delete(socket.id);

    // Notificar a los clientes sobre la actualización
    io.emit('update-clients', Array.from(connectedClients.values()));
  });

  // Evento para solicitar la lista de clientes conectados
  socket.on('get-clients', () => {
    socket.emit('update-clients', Array.from(connectedClients.values()));
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

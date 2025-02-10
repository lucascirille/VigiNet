import http from 'http';
import app from './src/app.mjs'; // Asegúrate de que el archivo 'app.mjs' esté correctamente configurado
import { Server } from 'socket.io';  // Usamos Server en lugar de socketIo

const server = http.createServer(app);  // Crear el servidor HTTP con Express
const io = new Server(server);  // Crear la instancia de socket.io con el servidor HTTP

// Cuando un cliente se conecta
io.on('connection', (socket) => {
  console.log('Usuario conectado: ', socket.id);

  // Evento para que el usuario se una a un vecindario específico
  socket.on('unirseAlVecindario', (vecindarioId) => {
    // El usuario se une a una "sala" de socket.io que es el vecindario
    socket.join(vecindarioId);
    console.log(`Usuario ${socket.id} se unió al vecindario ${vecindarioId}`);
  });

  // Evento para emitir una alarma solo al vecindario específico
  socket.on('nuevaAlarma', (data) => {
    const { vecindarioId, alarma } = data;  // Obtenemos el vecindario y la alarma
    io.to(vecindarioId).emit('nuevaAlarma', alarma);  // Emitimos solo a los usuarios en esa sala
  });

  // Desconexión del usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado: ', socket.id);
  });
});

const port = process.env.PORT || 3000;  // Definir el puerto

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

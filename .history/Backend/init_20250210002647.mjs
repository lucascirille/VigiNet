// src/init.mjs
import http from 'http';
import app from '../src/app.mjs';  // Tu aplicación Express
import socketIo from 'socket.io';

const server = http.createServer(app);  // Crear servidor HTTP usando Express
const io = socketIo(server);  // Asociar socket.io con el servidor

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  // Aquí puedes manejar eventos de socket
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

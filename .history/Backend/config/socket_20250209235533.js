const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  // Aquí puedes escuchar y emitir eventos de sockets
});

server.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});

const server = require('http').createServer();
const io = require('socket.io')(server, {
  transports: ['websocket', 'polling'] // Asegúrate de incluir ambos transportes
});

io.on('connection', (socket) => {
  console.log('Usuario conectado', socket.id);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

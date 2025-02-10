import http from 'http';
import app from './src/app';  // Tu aplicación Express
import { Server } from 'socket.io';  // Cambié la importación aquí

const server = http.createServer(app);  // Crear un servidor HTTP usando Express
const io = new Server(server);  // Usar new Server en lugar de socketIo

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  // Aquí puedes manejar eventos de socket
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

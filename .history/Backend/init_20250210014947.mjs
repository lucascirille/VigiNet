import http from 'http';
import app from './src/app.mjs';
import { Server } from 'socket.io';
import cors from 'cors';

// Configurar CORS para Express
app.use(cors({
  origin: ["http://localhost:8081", "http://localhost:3000"], // Añade aquí todos los orígenes permitidos
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const server = http.createServer(app);

// Configurar Socket.IO con opciones CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8081", "http://localhost:3000"], // Los mismos orígenes que arriba
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log('Usuario conectado: ', socket.id);

  socket.on('unirseAlVecindario', (vecindarioId) => {
    socket.join(vecindarioId);
    console.log(`Usuario ${socket.id} se unió al vecindario ${vecindarioId}`);
  });

  socket.on('nuevaAlarma', (data) => {
    const { vecindarioId, alarma } = data;
    io.to(vecindarioId).emit('nuevaAlarma', alarma);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado: ', socket.id);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
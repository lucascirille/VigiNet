import { Server } from "socket.io";

export function configureSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:8081"],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on("connection", (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on("unirseVecindario", (vecindarioId) => {
      socket.join(`vecindario_${vecindarioId}`);
      console.log(`Usuario ${socket.id} unido a vecindario ${vecindarioId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Usuario desconectado: ${socket.id}`);
    });
  });

  return io;
}
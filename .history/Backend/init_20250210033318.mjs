import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const usuarios = new Map(); // Guardar usuarios conectados

io.on("connection", (socket) => {
  console.log("Usuario conectado: ", socket.id);

  socket.on("identificarUsuario", (userId) => {
    usuarios.set(socket.id, { userId });
    console.log(`Usuario identificado: ${userId}`);
  });

  socket.on("unirseAlVecindario", (vecindarioId) => {
    socket.join(`vecindario_${vecindarioId}`);
    console.log(`Usuario ${socket.id} se unió al vecindario vecindario_${vecindarioId}`);
  });

  socket.on("activarAlarma", ({ vecindarioId, alarma }) => {
    const mensaje = {
      title: "🚨 Alarma Activada",
      message: `${alarma.descripcion} - ${alarma.tipo}`,
    };
    console.log(`🚨 Notificación enviada a vecindario_${vecindarioId}:`, mensaje);

    // Enviar la notificación a todos los miembros del vecindario
    io.to(`vecindario_${vecindarioId}`).emit("nuevaAlarma", mensaje);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    usuarios.delete(socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});

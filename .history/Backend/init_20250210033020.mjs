import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let usuariosConectados = {};
let historialNotificaciones = [];

io.on("connection", (socket) => {
  console.log("🔌 Usuario conectado:", socket.id);

  // Manejo de identificación del usuario y su vecindario
  socket.on("identificarUsuario", ({ userId, vecindarioId }) => {
    usuariosConectados[userId] = { socketId: socket.id, vecindarioId };
    socket.join(`vecindario_${vecindarioId}`);

    console.log(`✅ Usuario ${userId} identificado en vecindario ${vecindarioId}`);
    console.log("Usuarios conectados:", usuariosConectados);

    // Enviar historial de notificaciones al usuario si se conecta después
    const notificacionesPendientes = historialNotificaciones.filter(
      (n) => n.vecindarioId === vecindarioId
    );

    notificacionesPendientes.forEach((n) =>
      io.to(socket.id).emit("nuevaAlarma", n.mensaje)
    );
  });

  // Manejo de alarmas para enviar notificaciones a todos los del vecindario
  socket.on("activarAlarma", ({ vecindarioId, alarma }) => {
    const mensaje = {
      title: "🚨 Alarma Activada",
      message: `${alarma.descripcion} - ${alarma.tipo}`,
    };

    // Guardar en el historial
    historialNotificaciones.push({ vecindarioId, mensaje });

    // Emitir a todos los usuarios conectados al vecindario
    io.to(`vecindario_${vecindarioId}`).emit("nuevaAlarma", mensaje);

    console.log(`🚨 Notificación enviada a vecindario ${vecindarioId}:`, mensaje);
  });

  // Manejo de desconexión de usuarios
  socket.on("disconnect", () => {
    Object.keys(usuariosConectados).forEach((userId) => {
      if (usuariosConectados[userId].socketId === socket.id) {
        console.log(`❌ Usuario ${userId} desconectado`);
        delete usuariosConectados[userId];
      }
    });
  });
});

console.log("🚀 Servidor WebSocket ejecutándose en el puerto 3000");

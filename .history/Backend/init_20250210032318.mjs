// backend/socketServer.js
const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let usuariosConectados = {};
let historialNotificaciones = [];

io.on("connection", (socket) => {
  console.log("🔌 Usuario conectado:", socket.id);

  // Registrar usuario cuando se conecta
  socket.on("identificarUsuario", ({ userId, vecindarioId }) => {
    usuariosConectados[userId] = { socketId: socket.id, vecindarioId };
    console.log("Usuarios conectados:", usuariosConectados);

    // Enviar notificaciones pasadas al usuario reconectado
    const notificacionesPendientes = historialNotificaciones.filter(
      (n) => n.vecindarioId === vecindarioId
    );

    notificacionesPendientes.forEach((n) =>
      io.to(socket.id).emit("nuevaAlarma", n.mensaje)
    );
  });

  // Enviar alarma a todos en el vecindario
  socket.on("activarAlarma", ({ vecindarioId, alarma }) => {
    const mensaje = {
      title: "🚨 Alarma Activada",
      message: `${alarma.descripcion} - ${alarma.tipo}`,
    };

    historialNotificaciones.push({ vecindarioId, mensaje });

    Object.keys(usuariosConectados).forEach((userId) => {
      if (usuariosConectados[userId].vecindarioId === vecindarioId) {
        io.to(usuariosConectados[userId].socketId).emit("nuevaAlarma", mensaje);
      }
    });
  });

  // Eliminar usuario cuando se desconecta
  socket.on("disconnect", () => {
    Object.keys(usuariosConectados).forEach((userId) => {
      if (usuariosConectados[userId].socketId === socket.id) {
        delete usuariosConectados[userId];
      }
    });
    console.log("❌ Usuario desconectado, lista actualizada:", usuariosConectados);
  });
});

console.log("🚀 Servidor WebSocket ejecutándose en el puerto 3000");

import http from "http";
import app from "./src/app.mjs";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

const usuariosPorVecindario = new Map();
const connectedClients = new Map();

io.on("connection", (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.id}`);

  connectedClients.set(socket.id, { id: socket.id });

  socket.on("identificarUsuario", ({ userId, vecindarioId }) => {
    console.log(
      `👤 Usuario ${userId} identificado, uniéndose al vecindario ${vecindarioId}`,
    );

    socket.userId = userId;
    socket.vecindarioId = vecindarioId;

    socket.join(`vecindario_${vecindarioId}`);

    if (!usuariosPorVecindario.has(vecindarioId)) {
      usuariosPorVecindario.set(vecindarioId, new Set());
    }
    usuariosPorVecindario.get(vecindarioId).add(userId);

    console.log(` Usuario ${userId} unido al vecindario ${vecindarioId}`);
    console.log(
      `Usuarios en vecindario ${vecindarioId}:`,
      Array.from(usuariosPorVecindario.get(vecindarioId)),
    );
  });

  socket.on("unirseAlVecindario", (vecindarioId) => {
    console.log(` Usuario se une al vecindario: ${vecindarioId}`);
    socket.join(`vecindario_${vecindarioId}`);
  });

  socket.on("enviarNotificacion", ({ sala, mensaje, tipo, emisor }) => {
    console.log(` Enviando notificación a la sala ${sala}: ${mensaje}`);

    const notificacion = {
      mensaje,
      tipo: tipo || "info",
      emisor: emisor || "Usuario",
      timestamp: new Date().toISOString(),
      vecindarioId: sala,
    };

    io.to(`vecindario_${sala}`).emit("notificacion", notificacion);
  });

  socket.on("nuevaAlarma", (data) => {
    console.log(`Nueva alarma recibida:`, data);
    const { vecindarioId, tipo, descripcion, emisor } = data;

    const notificacion = {
      mensaje: descripcion || `Alarma de ${tipo} activada`,
      tipo: "alarma",
      emisor: emisor || "Usuario",
      timestamp: new Date().toISOString(),
      vecindarioId,
    };

    io.to(`vecindario_${vecindarioId}`).emit("nuevaAlarma", notificacion);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);

    connectedClients.delete(socket.id);

    if (socket.userId && socket.vecindarioId) {
      const vecindario = usuariosPorVecindario.get(socket.vecindarioId);
      if (vecindario) {
        vecindario.delete(socket.userId);
        if (vecindario.size === 0) {
          usuariosPorVecindario.delete(socket.vecindarioId);
        }
      }
      console.log(
        `👤 Usuario ${socket.userId} removido del vecindario ${socket.vecindarioId}`,
      );
    }

    io.emit("update-clients", Array.from(connectedClients.values()));
  });

  socket.on("get-clients", () => {
    socket.emit("update-clients", Array.from(connectedClients.values()));
  });

  socket.on("get-vecindario-users", (vecindarioId) => {
    const usuarios = usuariosPorVecindario.get(vecindarioId) || new Set();
    socket.emit("vecindario-users", Array.from(usuarios));
  });
});

const port = process.env.PORT || 3000;

// Inicializar servidor
const startServer = async () => {
  try {
    // Iniciar servidor HTTP
    server.listen(port, () => {
      console.log(` Servidor corriendo en el puerto ${port}`);
      console.log(`Socket.IO configurado y listo`);
      console.log(` Historial de notificaciones persistente disponible`);
    });
  } catch (error) {
    console.error(" Error iniciando servidor:", error);
    process.exit(1);
  }
};

startServer();

// Exportar io para uso en otros módulos
export { io };

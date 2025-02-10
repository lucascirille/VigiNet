// config/socket.js
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

// app.mjs (tu archivo principal)
import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { configureSocket } from "./config/socket.js";

// Importar rutas
import vecindarioRoutes from "./routes/vecindarioRoutes.mjs";
import alarmaRoutes from "./routes/alarmaRoutes.mjs";
import usuarioRoutes from "./routes/usuarioRoutes.mjs";
import notificacionRoutes from "./routes/notificacionRoutes.mjs";
import enumGeoNamesRoutes from "./routes/enumGeoNamesRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import { verifyGeoDB } from "./helpers/verifyGeoDB.mjs";
import globalErrorHandler from "./middleware/globalErrorHandler.mjs";
import { cargarEnumerativa } from "./helpers/loadGeoNamesData.mjs";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configurar Socket.IO
const io = configureSocket(server);

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

// Ruta básica para la raíz
app.get("/", (_req, res) => {
  res.status(200).send("Bienvenido a la API de VegiNet");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);
app.use("/api/vecindarios", vecindarioRoutes);
app.use("/api/alarmas", alarmaRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/enumGeoNames", enumGeoNamesRoutes);

// Middleware de manejo de errores
app.use(globalErrorHandler);

// Verifica si la base de datos de geonames está cargada
if (await verifyGeoDB()) {
  cargarEnumerativa();
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

// client/socket.js (para el frontend)
import io from 'socket.io-client';

const socket = io("http://localhost:3001", {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true
});

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("connect_error", (error) => {
  console.error("Error de conexión:", error);
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});

export default socket;
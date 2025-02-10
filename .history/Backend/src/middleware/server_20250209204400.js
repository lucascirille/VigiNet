import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import alarmaRoutes from "./routes/alarmaRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Habilitar CORS para frontend
});

app.use(cors());
app.use(express.json());

// 🔥 Cargar rutas y pasar `io` como parámetro
app.use("/api/alarmas", alarmaRoutes(io));

// 🔥 Manejo de conexiones de usuarios
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

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

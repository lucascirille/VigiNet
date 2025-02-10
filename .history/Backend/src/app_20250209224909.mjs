import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

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

// Configuración de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: "*"
}));

// Socket.IO eventos
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("unirseVecindario", (vecindarioId) => {
    socket.join(`vecindario_${vecindarioId}`);
    console.log(`Usuario ${socket.id} unido a vecindario ${vecindarioId}`);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Rutas
app.get("/", (_req, res) => {
  res.status(200).send("Bienvenido a la API de VegiNet");
});

app.use("/api/auth", authRoutes);
app.use("/api/vecindarios", vecindarioRoutes);
app.use("/api/alarmas", alarmaRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/enumGeoNames", enumGeoNamesRoutes);

app.use(globalErrorHandler);

if (await verifyGeoDB()) {
  cargarEnumerativa();
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

export default app;
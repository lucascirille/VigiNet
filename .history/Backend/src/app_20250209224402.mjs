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

export default app;

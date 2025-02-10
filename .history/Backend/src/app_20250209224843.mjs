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
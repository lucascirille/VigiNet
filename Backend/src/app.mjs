// src/app.mjs
import express from "express";
import vecindarioRoutes from "./routes/vecindarioRoutes.mjs";
import alarmaRoutes from "./routes/alarmaRoutes.mjs";
import usuarioRoutes from "./routes/usuarioRoutes.mjs";
import notificacionRoutes from "./routes/notificacionRoutes.mjs";
import enumGeoNamesRoutes from "./routes/enumGeoNamesRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs"; // Importa las rutas de autenticación
import { verifyGeoDB } from "./helpers/verifyGeoDB.mjs";
import morgan from "morgan";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler.mjs";
import { cargarEnumerativa } from "./helpers/loadGeoNamesData.mjs";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:8081",
  }),
);

// Ruta básica para la raíz
app.get("/", (_req, res) => {
  res.status(200).send("Bienvenido a la API de VegiNet");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes); // Aquí defines la ruta base para autenticación

// Rutas de vecindarios
app.use("/api/vecindarios", vecindarioRoutes);

// Rutas de alarmas
app.use("/api/alarmas", alarmaRoutes);

// Rutas de notificaciones
app.use("/api/notificaciones", notificacionRoutes);

// Rutas de Usuario
app.use("/api/usuarios", usuarioRoutes);

// Rutas de Enumerativa
app.use("/api/enumGeoNames", enumGeoNamesRoutes);

// Middleware de manejo de errores
app.use(globalErrorHandler);

// Verifica si la base de datos de geonames está cargada
if (await verifyGeoDB()) {
  cargarEnumerativa();
}



export default app;

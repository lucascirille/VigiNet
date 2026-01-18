import express from "express";
import * as historialController from "../controllers/historialNotificacionesController.mjs";
import {authenticateToken} from "../middleware/authMiddleware.mjs";

const router = express.Router();


router.use(authenticateToken);


router.get("/vecindario/:vecindarioId", historialController.obtenerHistorial);


router.get("/vecindario/:vecindarioId/tipo/:tipo", historialController.obtenerHistorialPorTipo);


router.get("/vecindario/:vecindarioId/buscar", historialController.buscarNotificaciones);


router.get("/vecindario/:vecindarioId/recientes", historialController.obtenerNotificacionesRecientes);


router.post("/vecindario/:vecindarioId/prueba", historialController.agregarNotificacionesPrueba);

export default router; 
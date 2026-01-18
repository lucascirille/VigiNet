import express from "express";
import * as alarmaController from "../controllers/alarmaController.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();


router.get("/estadisticas/:vecindarioId", alarmaController.getEstadisticasVecindario);


router.post("/activar", authenticateToken, alarmaController.activarAlarma);

router
  .route("/")
  .get(alarmaController.getAllAlarmas)
  .post(authenticateToken, alarmaController.createAlarma);

router
  .route("/:id")
  .get(alarmaController.updateAlarma)
  .delete(authenticateToken, alarmaController.deleteAlarma);

export default router;


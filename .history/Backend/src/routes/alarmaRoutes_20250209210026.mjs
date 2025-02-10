import express from "express";
import * as alarmaController from "../controllers/alarmaController.mjs";
import { verificarToken } from "../middleware/authMiddleware.mjs";


export default (io) => {
  const router = express.Router();

  router
    .route("/")
    .get(alarmaController.getAllAlarmas)
    .post(alarmaController.createAlarma);

  router
    .route("/:id")
    .get(alarmaController.updateAlarma)
    .delete(alarmaController.deleteAlarma);

  router.post("/activar", verificarToken, (req, res) => activarAlarmaController(req, res, io));

  return router;
};

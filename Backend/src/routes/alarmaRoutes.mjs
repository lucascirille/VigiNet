import express from "express";
import * as alarmaController from "../controllers/alarmaController.mjs";


const router = express.Router();

router
  .route("/")
  .get(alarmaController.getAllAlarmas)
  .post(alarmaController.createAlarma);

router
  .route("/:id")
  .get(alarmaController.updateAlarma)
  .delete(alarmaController.deleteAlarma);


export default router;


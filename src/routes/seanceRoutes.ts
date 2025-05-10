import { Router } from "express";
import * as controller from "../controllers/seanceController";

const router = Router();

router.get("/", controller.getAllSeance);
router.get("/:id", controller.getOneSeance);
router.post("/", controller.createSeance);
/*router.put("/:id", controller.updateSeance);
router.delete("/:id", controller.removeSeance);*/

// ajouter route pour voir les seances selon des filtres

export default router;

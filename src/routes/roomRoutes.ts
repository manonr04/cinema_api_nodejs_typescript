import { Router } from "express";
import * as controller from "../controllers/roomController";

const router = Router();

router.get("/", controller.getAllRooms);
router.get("/:id", controller.getRoomById);
router.post("/", controller.createRoom);
router.put("/:id", controller.updateRoom);
router.delete("/:id", controller.deleteRoom);

export default router;
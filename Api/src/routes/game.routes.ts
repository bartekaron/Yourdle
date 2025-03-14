import { Router } from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import * as gameController from "../controllers/game.controller";
const router = Router();

router.get("/allClassic/:id", gameController.getAllClassic);

router.get("/solutionClassic/:id", gameController.getSolutionClassic);

router.get("/allEmoji/:id", gameController.getAllEmoji);

router.get("/solutionEmoji/:id", gameController.getSolutionEmoji);

export default router;
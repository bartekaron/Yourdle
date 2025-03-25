import { Router } from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import * as gameController from "../controllers/game.controller";
const router = Router();

router.get("/allClassic/:id", gameController.getAllClassic);

router.get("/solutionClassic/:id", gameController.getSolutionClassic);

router.get("/allEmoji/:id", gameController.getAllEmoji);

router.get("/solutionEmoji/:id", gameController.getSolutionEmoji);

router.get("/allDescription/:id", gameController.getAllDescription);

router.get("/solutionDescription/:id", gameController.getSolutionDescription);

router.get("/allQuote/:id", gameController.getAllQuote);

router.get("/solutionQuote/:id", gameController.getSolutionQuote);

router.get("/allPicture/:id", gameController.getAllPicture);

router.get("/solutionPicture/:id", gameController.getSolutionPicture);

export default router;
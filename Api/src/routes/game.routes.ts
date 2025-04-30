import { Router } from "express";
import { getAllClassic, getAllEmoji, getSolutionClassic, getSolutionEmoji, getAllDescription, getSolutionDescription, getSolutionQuote, getAllQuote, getAllPicture, getSolutionPicture, getAllLeaderboard, getLeaderboardOneUser, saveMatchResult, uploadLeaderboard } from "../controllers/game.controller";
import { authMiddleware } from "../middleware/AuthMiddleware";
const router = Router();

router.get("/allClassic/:id", getAllClassic);

router.get("/solutionClassic/:id", getSolutionClassic);

router.get("/allEmoji/:id", getAllEmoji);

router.get("/solutionEmoji/:id", getSolutionEmoji);

router.get("/allDescription/:id", getAllDescription);

router.get("/solutionDescription/:id", getSolutionDescription);

router.get("/allQuote/:id", getAllQuote);

router.get("/solutionQuote/:id", getSolutionQuote);

router.get("/allPicture/:id", getAllPicture);

router.get("/solutionPicture/:id", getSolutionPicture);

router.post("/leaderboard", authMiddleware ,uploadLeaderboard);

router.get("/leaderboard" ,getAllLeaderboard);

router.get("/leaderboard/:id",  getLeaderboardOneUser);

router.post("/saveMatchResult",  saveMatchResult);

export default router;
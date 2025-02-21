import { Router } from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import * as userController from "../controllers/user.controller";
const router = Router();


router.post("/login", userController.login)

router.post("/register", userController.register)

router.patch("/profile", authMiddleware, userController.updateProfile)

router.get("/:id", authMiddleware, userController.getUser)

router.delete("/deleteProfilePicture/:id", authMiddleware, userController.deleteProfilePicture);

router.post("/change-password/:id", authMiddleware, userController.changePassword)

router.get("/history/:id", authMiddleware, userController.matchHistory);



export default router;
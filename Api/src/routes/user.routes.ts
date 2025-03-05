import { Router } from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import * as userController from "../controllers/user.controller";
const router = Router();

// User routes

router.post("/login", userController.login)

router.post("/register", userController.register)

router.patch("/profile", authMiddleware, userController.updateProfile)

router.get("/user/:id", authMiddleware, userController.getUser)

router.delete("/deleteProfilePicture/:id", authMiddleware, userController.deleteProfilePicture);

router.patch("/change-password/:id", authMiddleware, userController.changePassword)

router.get("/history/:id", authMiddleware, userController.matchHistory);

router.get("/allUsers", authMiddleware, userController.getAllUsers)

// Admin routes

// Delete by email
router.delete("/delete/:email", authMiddleware, userController.deleteUser)

// Edit user
router.patch("/edit/:id", authMiddleware, userController.editUser)

export default router;
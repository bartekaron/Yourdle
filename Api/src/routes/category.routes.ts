import { Router } from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import * as categoryController from "../controllers/category.controller";
const router = Router();

router.get("/allPublicCategories", categoryController.getPublicCategories);

export default router;
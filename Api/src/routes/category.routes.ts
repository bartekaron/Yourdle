import { Router } from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import * as categoryController from "../controllers/category.controller";
const router = Router();

router.get("/allPublicCategories", categoryController.getPublicCategories);

router.get("/category/:id", categoryController.getCategoryByID);

router.post("/category", categoryController.createCategory);

export default router;
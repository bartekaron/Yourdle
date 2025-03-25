import { Router } from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import * as categoryController from "../controllers/category.controller";
const router = Router();

router.get("/allPublicCategories", categoryController.getPublicCategories);

router.get("/category/:id", categoryController.getCategoryByID);

router.post("/category", categoryController.createCategory);

router.post("/classic", categoryController.createClassic);

router.post("/description", categoryController.createDescription);

router.post("/quote", categoryController.createQuote);

router.post("/picture", categoryController.createPicture);

router.post("/emoji", categoryController.createEmoji);

router.get("/allCategory", authMiddleware, categoryController.getAllCategories)

router.get("/data/:id", authMiddleware,categoryController.getCategoryData)

router.delete("/:id", authMiddleware, categoryController.deleteCategory)

export default router;
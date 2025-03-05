import { Router } from "express";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import gameRoutes from "./game.routes";

const router = Router();


router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/games", gameRoutes);



export default router;
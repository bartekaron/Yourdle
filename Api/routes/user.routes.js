const { Router } = require("express");
const userController = require('../controllers/user.controller');
const { authMiddleware } = require("../middleware/AuthMiddleware");

const router = Router();


router.post("/login", userController.login)

router.post("/register", userController.register)

router.patch("/profile", authMiddleware, userController.updateProfile)

router.get("/:id", authMiddleware, userController.getUser)

router.post("/change-password/:id", authMiddleware, userController.changePassword)

module.exports = router;
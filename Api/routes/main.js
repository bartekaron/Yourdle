const { Router } = require("express");
const userRoutes = require('./userRoutes')

const router = Router();


router.use("/users", userRoutes);



module.exports = router;
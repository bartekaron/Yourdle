const { loginUser } = require("../services/userService");



login = async (req, res , next)=>{
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Hiányzó adatok"});
        }
        res.status(201).json(await loginUser(email, password));
    } catch (error) {
        next(error);
    }
}





module.exports = {login}
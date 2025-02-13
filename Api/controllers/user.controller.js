const { loginUser, registerUser } = require("../services/user.service.js");

login = async (req, res) => {
    try {
        const { email, passwd } = req.body;
        if (!email || !passwd) {
            return res.status(400).json({ message: "Hiányzó adatok" });
        }

        const token = await loginUser(email, passwd);
        res.status(200).json({ token });
    } catch (error) {
        // Ha van status mezője (pl. egyedi hibaobjektum), azt használja
        const status = error.status || 401;
        res.status(status).json({ message: error.message });
    }
}

register = async (req, res, next) => {
    try {
        const { name, email, password, confirm } = req.body;

        if (!name || !email || !password || !confirm) {
            return res.status(400).json({ success: false, message: 'Hiányzó adatok!' });
        }

        if (password !== confirm) {
            return res.status(400).json({ success: false, message: 'A jelszavak nem egyeznek!' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'Érvénytelen email cím!' });
        }

        const role = 'user';
        const user = await registerUser(name, email, password, role);

        res.status(201).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

module.exports = {login, register}
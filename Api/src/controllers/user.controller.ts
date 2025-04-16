import { checkOldPassword, deleteProfilePictureService, getMatchHistory, getOneUser, loginUser, registerUser, updatePassword, updateUserProfile, getAllUsersService, deleteUserByEmail, editUserService } from "../services/user.service";
import { decrypt } from "../utils/decrypt";
const { pool } = require ("../config/database")
import { promisify } from 'util';
const query = promisify(pool.query).bind(pool);

export const login = async (req, res, next) => {
    try {
        const { email, passwd } = req.body;
        if (!email || !passwd) {
            return res.status(400).json({ success:false, message: "Hiányzó adatok!" });
        }
        const token = await loginUser(email, passwd);
        res.status(200).json({ success:true, token });
    } catch (err) {
        next(err);
    }
}

export const register = async (req, res, next) => {
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

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot!'
            });
        }

        const existingUsers = await query(
            'SELECT * FROM users WHERE email = ? OR name = ?',
            [email, name]
        );

        if (existingUsers.length > 0) {
            const alreadyTaken = existingUsers[0].email === email ? 'email' : 'felhasználónév';
            return res.status(400).json({
                success: false,
                message: `Ez a ${alreadyTaken} már regisztrálva van!`
            });
        }

        const role = 'user';
        const user = await registerUser(name, email, password, role);

        res.status(201).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldpasswd, passwd, confirm } = req.body;
        const userId  = req.params.id; 

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(passwd)) {
            return res.status(400).json({
                success: false,
                message: 'A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot!'
            });
        }

        if (!oldpasswd || !passwd || !confirm) {
            return res.status(400).json({ success: false, message: 'Hiányzó adatok!' });
        }

        if (passwd !== confirm) {
            return res.status(400).json({ success: false, message: 'A jelszavak nem egyeznek!' });
        }

        await checkOldPassword(userId, oldpasswd);

        await updatePassword(userId, passwd);

        return res.status(200).json({ success: true, message: 'Jelszó sikeresen frissítve!' });

    } catch (err) {
        console.error('Hiba:', err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, id } = req.body;

        if (!name || !email || !id) {
            return res.status(400).json({ success: false, message: 'Hiányzó adatok!' });
        }
        
        const updatedUser = await updateUserProfile(id, name, email);
        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        next(err);
    }
};


export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }

        const user = await getOneUser(id);
        if (!user.profilePic) {
            user.profilePic = `http://localhost:3000/uploads/placeholder.png`;
        } else {
            user.profilePic = decrypt(user.profilePic); // Visszafejtés
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};


export const getAllUsers = async (_req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};


export const deleteProfilePicture = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó felhasználói azonosító!" });
        }

        // Meghívjuk a userService-t a profilkép törlésére
        const result = await deleteProfilePictureService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (err) {
        next(err);
    }
};


export const matchHistory = async (req, res, next) =>{
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó felhasználói azonosító!" });
        }

        const result = await getMatchHistory(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
}



const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Admin

// Delete user by email

export const deleteUser = async (req, res, next) => {
    try {
        const email = req.params.email;
        if (!email) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }

        const user = await deleteUserByEmail(email);
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}

// Edit user by id
 
export const editUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const  { name, email, role } = req.body;
        if (!id || !name || !email || !role) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
 
        const user = await editUserService(id, name, email, role);
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}
import { checkOldPassword, deleteProfilePictureService, getMatchHistory, getOneUser, loginUser, registerUser, updatePassword, updateUserProfile } from "../services/user.service";
import { decrypt } from "../utils/decrypt";



export const login = async (req, res, next) => {
    try {
        const { email, passwd } = req.body;
        if (!email || !passwd) {
            return res.status(400).json({ success:false, message: "Hiányzó adatok" });
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

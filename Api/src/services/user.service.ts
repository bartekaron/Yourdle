import { decrypt } from "../utils/decrypt";
const { pool } = require ("../config/database")
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require("../utils/token");
const path = require('path');
const fs = require("fs");


export const loginUser = async (email, passwd) => {
    try {
        const results:any = await new Promise((resolve, reject) => {
            pool.query(`SELECT id, name, email, passwd, profilePic, role FROM users WHERE email=?`, [email], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        
        if (results.length === 0) {
            const error:any = new Error('Nincs ilyen felhasználó');
            error.status = 404;
            throw error;
        }
        
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(passwd, user.passwd);
        if (!isPasswordValid) {
            const error:any = new Error("Hibás jelszó!");
            error.status = 401;
            throw error;
        }
        
        const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role, image: user.profilePic });
        return token;

    } catch (error) {
        console.error(error.message);
        throw error;
    }
};


export const registerUser = async (name, email, password, role) => {
    try {
        const id = uuidv4(); // UUID generálása
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (id, name, email, passwd, role) VALUES (?, ?, ?, ?, ?)`;
        const values = [id, name, email, hashedPassword, role];

        const result = await pool.query(sql, values);

        return { id, name, email, role };
    } catch (error) {
        console.error("Hiba a regisztráció során:", error);
        throw new Error('Hiba a felhasználó regisztrációja során: ' + error.message);
    }
};

export const updateUserProfile = async (id, name, email) => {

    const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    const values = [name, email, id];
    
    await pool.query(sql, values);
    
    const updatedUser = await getOneUser(id);

    const token = generateToken({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, image: updatedUser.profilePic });

    return { user: updatedUser, token };
};

export const getOneUser = async (id)=>{
    const results:any = await new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE id=?`, [id], (err, results) => {
            if (err) {
                const error:any = new Error('Hiba az adatbázis kapcsolatban');
                error.status = 500;
                return reject(error);
            }
            resolve(results);
        });
    });
    
    if (results.length === 0) {
        const error:any = new Error('Nincs ilyen felhasználóasd');
        error.status = 404;
        throw error;
    }
    
    const user = results[0];
    
    return user;

}

export const getAllUsersService = async () => {
    const results:any = await new Promise((resolve, reject) =>
        pool.query(`SELECT id, name, email, role, profilePic FROM users`, (err, results) => {
            if (err) {
                const error:any = new Error('Hiba az adatbázis kapcsolatban');
                error.status = 500;
                return reject(error);
            }
            resolve(results);
        })
    );

    if (results.length === 0) {
        const error:any = new Error('Hiba történt a felhasználók lekérdezése során');
        error.status = 404;
        throw error;
    }

    return results;
}

export const checkOldPassword = async (userId, oldpasswd) => {
    const user = await getOneUser(userId)  

    if (!user) { 
        throw new Error('Felhasználó nem található!');
    }

    const match = await bcrypt.compare(oldpasswd, user.passwd);

    if (!match) {
        throw new Error('A régi jelszó helytelen!');
    }

    return true;
};


export const updatePassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET passwd = ? WHERE id = ?', [hashedPassword, userId]);
};


export const deleteProfilePictureService = async (userId) => {
    try {
        // Lekérjük a felhasználót az adatbázisból
        const user = await getOneUser(userId);
        if (!user.profilePic) {
            return { success: false, message: "Nincs profilkép, amit törölhetnél!" };
        }

        const imagePath = path.join(__dirname, "../../uploads/", path.basename(decrypt(user.profilePic)));


        // Ellenőrizzük, hogy a fájl létezik-e, és töröljük
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Frissítjük az adatbázist, hogy töröljük a profilképet
        await pool.query("UPDATE users SET profilePic = NULL WHERE id = ?", [userId]);

        return { success: true, message: "Profilkép sikeresen törölve!" };
    } catch (err) {
        console.error("Hiba történt a profilkép törlésénél:", err);
        return { success: false, message: "Hiba történt a profilkép törlése közben!" };
    }
};

export const getMatchHistory = async(id)=>{
    try {
        const results:any = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM games_vt WHERE player1ID = ? or player2ID = ?`, [id, id], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        if (results.length === 0) {
            const error:any = new Error('Nincs ilyen felhasználó');
            error.status = 404;
            throw error;
        }
        return {success:true, results};


    } catch (error) {
        return {success: false, message:"Nem sikerült lekérni a meccs előzményeket"}
    }
}

//Admin

//Delete user by email

export const deleteUserByEmail = async (email) => {
    try {
        const results:any = await new Promise((resolve, reject) => {
            pool.query(`DELETE FROM users WHERE email = ?`, [email], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        return { success: true, message: "Felhasználó sikeresen törölve!" };
    } catch (error) {
        return { success: false, message: "Nem sikerült törölni a felhasználót" };
    }
}

// Edit user by id
 
export const editUserService = async (id, name, email, role) => {
    try {
        const results:any = await new Promise((resolve, reject) => {
            pool.query(`UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`, [name, email, role, id], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        return { success: true, message: "Felhasználó sikeresen módosítva!" };
    } catch (error) {
        return { success: false, message: "Nem sikerült módosítani a felhasználót" };
    }
}

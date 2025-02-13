const { pool } = require ("../config/database")
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require("../utils/token");


const loginUser = async (email, passwd) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`SELECT id, name, email, passwd, role FROM users WHERE email=?`, [email], (err, results) => {
                if (err) {
                    const error = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        
        if (results.length === 0) {
            const error = new Error('Nincs ilyen felhasználó');
            error.status = 404;
            throw error;
        }
        
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(passwd, user.passwd);
        if (!isPasswordValid) {
            const error = new Error("Hibás jelszó!");
            error.status = 401;
            throw error;
        }
        
        const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });
        return token;

    } catch (error) {
        console.error(error.message);
        throw error;
    }
};


registerUser = async (name, email, password, role) => {
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
module.exports = {loginUser, registerUser}
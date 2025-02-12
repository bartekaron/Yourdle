const { pool } = require ("../config/database")
const bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require("../utils/token");


loginUser = async (email, passwd) =>{
    pool.query(`SELECT id, name, email, passwd FROM Users WHERE email=? AND passwd=?`, [email, CryptoJS.SHA1(passwd).toString()], (err, results)=>{
        if (err){
            return ("Hiba történt az adatbázis lekérdezés közben");
        }
        if (results.length == 0) {
            return ('Hibás belépési adatok!');
            
        }
        const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });
        return token;
    })
}
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
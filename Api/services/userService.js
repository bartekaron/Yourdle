const { pool } = require ("../config/database")
var CryptoJS = require("crypto-js");
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

module.exports = {loginUser}
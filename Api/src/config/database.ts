import "dotenv/config";
var mysql = require('mysql');

export const pool  = mysql.createPool({
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME,
    charset: "utf8mb4"
});

export const jwtSecret = process.env.JWT_SECRET
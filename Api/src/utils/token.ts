import "dotenv/config";
var jwt = require('jsonwebtoken');
import { jwtSecret } from "../config/database";
 
export const generateToken = (payload) => {
    return jwt.sign({data: payload}, jwtSecret, { expiresIn: "1d" });
};


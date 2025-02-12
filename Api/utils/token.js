var jwt = require('jsonwebtoken');
require('dotenv').config();
 
generateToken = (payload) => {
    return jwt.sign({data: payload}, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {generateToken}
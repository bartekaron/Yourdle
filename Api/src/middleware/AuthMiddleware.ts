require('dotenv').config();
const jwt = require('jsonwebtoken');


export const authMiddleware = (req, res, next)=>{
    const token = req.headers.authorization?.split(' ')[1];
 
    if (!token){
        return res.status(400).json({
            success: false,
            message: 'Hozzáférés megtagadva! Hiányzó token!'
        });
    }
  
    
    try{
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();  
    }catch(error){
      res.status(400).send('Érvénytelen vagy lejárt token!');
    }
}



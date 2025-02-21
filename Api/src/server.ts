import "dotenv/config";
const express = require( "express");
const cors = require('cors');
const multer = require('multer');
import router from './routes/main';
const nodemailer = require('nodemailer');
import { pool } from "./config/database"
import { encrypt } from "./utils/decrypt";
import { authMiddleware } from "./middleware/AuthMiddleware";
import path = require("path");


const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use("/api", router);
//Hibakezelő middelware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const message = err.message || 'Ismeretlen hiba történt.';
    res.status(statusCode).json({ message });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Konfiguráljuk a fájlok feltöltését
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalname = file.originalname.replace(' ', '_');
        const name = originalname.substring(0, originalname.lastIndexOf('.'));
        const ext = originalname.substring(originalname.lastIndexOf('.'));
        cb(null, name + '-' + timestamp + ext);
    }
  });

const upload = multer({ storage: storage });

app.post('/uploadProfilePicture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const encryptedUrl = encrypt(imageUrl); // Titkosítás

    await pool.query('UPDATE users SET profilePic = ? WHERE id = ?', [encryptedUrl, req.body.id]);

    res.status(200).json({ success: true });
});

// Email

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'yourdlehelp@gmail.com',
      pass: 'jlii yqlq lepz zqhc'
    },
});
 
app.post('/api/forgott-password',  async (req, res) => {
    let Email = "";
    try{
        const {email} = req.body;
        Email = email;
        // send mail
        const info = await transporter.sendMail({
        from: "smtp.gmail.com", // sender address
        // list of receivers
        to: `${Email}`, // list of receivers
        subject: "Jelszó változtatás", // Subject line
        text: `Erre a linkre kattintva átirányítunk weboldalounkra, ahol megadhatod új jelszavad! : link`, // plain text body
        html: `<b>Erre a linkre kattintva átirányítunk weboldalounkra, ahol megadhatod új jelszavad! : link</b>`, // html body
        });
 
        res.status(200).json({ message: 'Email sent!', data: info });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Email not sent!', data: err });
    }
 
});



app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

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
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Ha kell, pontosítsd az engedélyezett domaineket
    },
});


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

const rooms = new Map();

io.on("connection", (socket) => {
    console.log("Felhasználó csatlakozott:", socket.id);

    socket.on("createRoom", ({ roomName, category, gameTypes, owner }) => {
        if (!rooms.has(roomName)) {
            rooms.set(roomName, { owner, category, gameTypes, members: [socket.id] });
            socket.join(roomName);
            
            // Szoba létrehozása után értesítjük a frontend-et
            io.emit("roomList", Array.from(rooms.entries()).map(([roomName, data]) => ({
                roomName,
                owner: data.owner,
                category: data.category,
                gameTypes: data.gameTypes,
            })));
    
            // Értesítés a szoba létrehozásáról
            socket.emit("roomCreated", roomName); // Üzenet a frontendnek a sikeres létrehozásról
            console.log(`Szoba létrehozva: ${roomName}, Kategória: ${category}, Játék típusok: ${gameTypes.join(", ")}`);
        }
    });
    

    // Szoba listázása (amikor valaki belép)
    socket.on("getRooms", () => {
        const roomData = Array.from(rooms.entries()).map(([roomName, data]) => ({
            roomName,
            category: data.category,
            gameTypes: data.gameTypes,
        }));
        socket.emit("roomList", roomData);
    });

    // Szoba elhagyása
    socket.on("leaveRoom", ({ roomName }) => {
        socket.leave(roomName);
        console.log(`${socket.id} kilépett a szobából: ${roomName}`);

        if (rooms.has(roomName)) {
            const room = rooms.get(roomName);
            room.members = room.members.filter(id => id !== socket.id);
            if (room.members.length === 0) {
                rooms.delete(roomName);
                io.emit("roomList", Array.from(rooms.keys()));
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("Felhasználó lecsatlakozott:", socket.id);
    });
});


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

server.listen(3001, () => {
    console.log(`Server running on http://localhost:${3001}`);
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

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
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200", // Ha kell, pontosítsd az engedélyezett domaineket
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

    socket.on("createRoom", ({ roomName, category, gameTypes, owner }) => {
        if (!rooms.has(roomName)) {
            rooms.set(roomName, { 
                owner, 
                category, 
                gameTypes, 
                members: [{ id: socket.id, name: owner }] // Az új szoba létrehozásakor itt csak a tulajdonos kerül bele
            });
            socket.join(roomName);

            // Az új szoba hozzáadását követően értesítjük az összes klienst a szobák listájával
            io.emit("roomList", Array.from(rooms.entries()).map(([roomName, data]) => ({
                roomName,
                owner: data.owner,
                category: data.category,
                gameTypes: data.gameTypes,
            })));

            // A létrehozott szoba játékosainak listája
            io.to(roomName).emit("playerList", rooms.get(roomName).members);

            // A szoba létrehozója visszajelzést kap a sikeres létrehozásról
            socket.emit("roomCreated", { roomName, owner, redirect: true });
        } else {
            // Ha a szoba már létezik, akkor jelezni kell, hogy nem lehet létrehozni
            socket.emit("roomCreated", { success: false, message: "Ez a szoba már létezik!" });
        }
    });


   /* Most 2x tesz bele minden player-t ebbe itt lent csak 1x viszont úgy buggos a megjelenítés frontenden nagyon durván 
   socket.on("joinRoom", ({ roomName, name }) => {
        if (rooms.has(roomName)) {
            const room = rooms.get(roomName);
            // Ellenőrizzük, hogy a játékos még nincs-e a szobában
            if (!room.members.some(member => member.id === socket.id)) {
                room.members.push({ id: socket.id, name: name });
                socket.join(roomName);
            }
            // Küldjük az adatokat a kliensnek, hogy frissüljön a játékos lista
            io.to(roomName).emit("playerList", room.members);
        }
    });*/

    socket.on("joinRoom", ({ roomName, name }) => {
        if (rooms.has(roomName)) {
            const room = rooms.get(roomName);
            // Ellenőrizzük, hogy a játékos már nincs-e a szobában
            const isAlreadyInRoom = room.members.some(member => member.id === socket.id);
            
            if (!isAlreadyInRoom) {
                room.members.push({ id: socket.id, name: name });
                socket.join(roomName);
            }
    
            // Küldjük az adatokat a kliensnek, hogy frissüljön a játékos lista
            io.to(roomName).emit("playerList", room.members);
        }
    });
    
    socket.on("startGame", ({ roomName }) => {
        const room = rooms.get(roomName);
        
        // Ellenőrizzük, hogy a szoba létezik és hogy a játékot csak a tulajdonos indíthatja el
        if (room) {
            const playerCount = room.members.length;
            if (playerCount >= 2) {
                
                io.to(roomName).emit("gameStarted", { success: true, message: "Játék elindítva!" });
                // Ide majd talán, hogyan menjen a játék
            } else {
                io.to(roomName).emit("gameStarted", { success: false, message: "Legalább két játékosnak kell lenni a játék indításához." });
            }
        } 
    });



    socket.on("leaveRoom", ({ roomName }) => {
        if (rooms.has(roomName)) {
            const room = rooms.get(roomName);
            room.members = room.members.filter(member => member.id !== socket.id);
            socket.leave(roomName);
            io.to(roomName).emit("playerList", room.members);

            if (room.members.length === 0) {
                rooms.delete(roomName);
                io.emit("roomList", Array.from(rooms.keys()));
            }
        }
    });

    socket.on("disconnect", () => {
        rooms.forEach((room, roomName) => {
          room.members = room.members.filter(member => member.id !== socket.id);  // Töröljük a kilépett játékost
          io.to(roomName).emit("playerList", room.members);  // Frissítjük a játékoslistát minden szobában
          if (room.members.length === 0) {
            rooms.delete(roomName);  // Ha üres a szoba, töröljük
            io.emit("roomList", Array.from(rooms.keys()));  // Frissítjük a szobák listáját
          }
        });
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

app.post('/uploadCategoryPicture', authMiddleware, upload.single('picture'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { answer, categoryID } = req.body;
        if (!answer || !categoryID) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }

        // Encrypt image URL for storage
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        const encryptedUrl = encrypt(imageUrl); // Encrypt the image URL before saving

        // Return the success response
        res.status(200).json({ success: true, imageUrl: encryptedUrl });
    } catch (error) {
        next(error);
    }
});

// Email

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'yourdlehelpdesk@gmail.com',
      pass: 'rgji kerg hivt iius'
    },
});
 
app.post('/api/forgott-password',  async (req, res) => {
    let Email = "";
    try{
        const { email,  content } = req.body;
        Email = email;
        // send mail
        const info = await transporter.sendMail({
        from: process.env.SMTP_USER, // sender address
        // list of receivers
        to: `${Email}`, // list of receivers
        subject: "Elfelejtett jelszó visszaállítás", // Subject line
        text: `Erre a linkre kattintva átirányítunk weboldalounkra, ahol megadhatod új jelszavad! : link`, // plain text body
        html: `<b>Erre a linkre kattintva átirányítunk weboldalunkra, ahol megadhatod új jelszavad! : ${content}</b>`, // html body
        });
 
        res.status(200).json({ message: 'Email sent!', data: info , success: true});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Email not sent!', data: err, success: false});
    }
 
});

app.get('/api/public/:table/:field/:op/:value', (req, res)=>{
    let table = req.params.table;

    const public_tables = process.env.PUBLIC_TABLES.split(',');

    if (!public_tables.includes(table)){
        sendResults(res, '', {message: 'Nincs jogosultság hozzá!'});
        return
    }

    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk'){
        value = `%${value}%`;
    }

    pool.query(`SELECT * FROM ${table} WHERE ${field}${op}'${value}'`,  (err, results)=>{
        sendResults(res, err, results);
    });
});

app.patch('/api/public/:table/:field/:op/:value', (req, res)=>{
    let table = req.params.table;

    const public_tables = process.env.PUBLIC_TABLES.split(',');

    if (!public_tables.includes(table)){
        sendResults(res, '', {message: 'Nincs jogosultság hozzá!'});
        return
    }

    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk'){
        value = `%${value}%`;
    } 
    let fields = Object.keys(req.body);
    let values = Object.values(req.body);
    let updates = [];
    for (let i = 0; i < fields.length; i++) {
        updates.push(`${fields[i]}='${values[i]}'`);
    }
    let str = updates.join(',');    
    pool.query(`UPDATE ${table} SET ${str} WHERE ${field}${op}'${value}'`, (err, results)=>{
        sendResults(res, err, results,);
    });
});

function getOP(op){
    switch(op){
      case 'eq' : { op = '='; break }
      case 'lt' : { op = '<'; break }
      case 'gt' : { op = '>'; break }
      case 'lte': { op = '<='; break }
      case 'gte': { op = '>='; break }
      case 'not': { op = '!='; break }
      case 'lk' : { op = ' like '; break }
    }
    return op;
}

function sendResults(res, err, results){
    if (err){
        res.status(500).send(err);
        return
    }
    res.status(200).send(results);
}

server.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

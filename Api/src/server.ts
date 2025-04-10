import "dotenv/config";
const express = require( "express");
const cors = require('cors');
import router from './routes/main';
import { authMiddleware } from "./middleware/AuthMiddleware";
import path = require("path");
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocketIO } from "./duel";
import { forgotPassword, getPublicData, updatePublicData } from "./nodemailer";
import { uploadProfilePicture, uploadCategoryPicture, updateProfilePicture, updateCategoryPicture } from "./multer";
import {pool } from "./config/database";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//Hibakezelő middelware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const message = err.message || 'Ismeretlen hiba történt.';
    res.status(statusCode).json({ message });
});

//socketIO
initializeSocketIO(io); 

//multer
app.post('/uploadProfilePicture', authMiddleware, uploadProfilePicture, updateProfilePicture);
app.post('/uploadCategoryPicture', authMiddleware, uploadCategoryPicture, updateCategoryPicture);

// Email
app.post('/api/forgott-password', forgotPassword);
app.get('/api/public/:table/:field/:op/:value', getPublicData);
app.patch('/api/public/:table/:field/:op/:value', updatePublicData);

app.get('/api/sugo', (req, res) => {
    const sql = 'SELECT * FROM sugo';
    pool.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

app.get('/api/users', (req, res) => {
    const sql = 'SELECT name, email, id FROM users';
    pool.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

app.get('/api/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    pool.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});




server.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

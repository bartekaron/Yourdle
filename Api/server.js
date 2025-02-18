require('dotenv');
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');
const router = require('./routes/main')
const { pool } = require ("./config/database")

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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

app.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`; // Az URL, amit az adatbázisba mentünk

    // Mentsd az adatbázisba az imageUrl-t
    await pool.query('UPDATE users SET profilePic = ? WHERE id = ?', [imageUrl, req.body.id]);

    res.status(200).json({ imageUrl });
});



app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

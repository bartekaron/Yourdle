require('dotenv');
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
    console.log("Received file:", req.file);  // Ellenőrizzük, hogy a fájl megérkezik
    console.log("Received body:", req.body);  // Ellenőrizzük, hogy az ID megérkezik

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.body.id) {
        return res.status(400).json({ error: "No user ID provided" });
    }

    const fileBuffer = req.file.buffer;
    const id = req.body.id;

    try {
        const result = await pool.query(
            'UPDATE users SET profilePic = $1 WHERE id = $2 RETURNING id, profilePic',
            [fileBuffer, id]
        );

        console.log("SQL Query Result:", result);

        if (!result || !result.rows || result.rows.length === 0) {
            return res.status(404).json({ error: "User not found or update failed" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});



app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

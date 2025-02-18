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

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.body.id) {
        return res.status(400).json({ error: "No user ID provided" });
    }

    const fileBuffer = req.file.buffer;
    const id = req.body.id;

    try {
        await pool.query(
            'UPDATE users SET profilePic = ? WHERE id = ?', [fileBuffer, id], (err, results)=>{
                if (err) {
                    return res.status(500).json({error: "Hiba az adatbázisban"})
                }
                if (results.length === 0) {
                    return res.status(400).json({error: "Fos"});
                }
                res.status(200).json(results);
            }
        );
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});



app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

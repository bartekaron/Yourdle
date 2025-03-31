import { Request, Response, NextFunction } from 'express';
const multer = require('multer');
import { pool } from './config/database';
import { encrypt } from './utils/decrypt';

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

// Profile kép feltöltés
const uploadProfilePicture = upload.single('profilePicture');
const uploadCategoryPicture = upload.single('picture');

// Profile kép frissítés
const updateProfilePicture = async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const encryptedUrl = encrypt(imageUrl); // Titkosítás

    await pool.query('UPDATE users SET profilePic = ? WHERE id = ?', [encryptedUrl, req.body.id]);

    res.status(200).json({ success: true });
};

// Category kép frissítés
const updateCategoryPicture = async (req: Request, res: Response, next: NextFunction) => {
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
};

export { uploadProfilePicture, uploadCategoryPicture, updateProfilePicture, updateCategoryPicture };

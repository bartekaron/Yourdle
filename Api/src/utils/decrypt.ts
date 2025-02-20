const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.JWT_SECRET, 'salt', 32); // Titkosítási kulcs

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Véletlenszerű IV minden titkosításnál
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Az IV-t hozzáfűzzük az adathoz
};

export const decrypt = (text) => {
    const parts = text.split(':'); // Az IV és az adat szétválasztása
    if (parts.length !== 2) {
        throw new Error("Invalid encrypted text format");
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};



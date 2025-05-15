const nodemailer = require('nodemailer');
import { pool } from "../config/database";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'yourdlehelpdesk@gmail.com',
        pass: 'rgji kerg hivt iius'
    },
});

export async function sendMail({ to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
            html,
        });
        return { success: true, data: info };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
}

export async function forgotPassword(req, res) {
    try {
        const { email, content } = req.body;
        const result = await sendMail({
            to: email,
            subject: "Elfelejtett jelszó visszaállítás",
            text: "Erre a linkre kattintva átirányítunk weboldalunkra, ahol megadhatod új jelszavad! A link 30 percig érvényes! : link",
            html:` <div style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: #58a6ff; font-family: 'Share Tech Mono', monospace; padding: 20px; border: 2px solid #21262d; border-radius: 10px;">
            <h1 style="text-align: center; color: #58a6ff;">Yourdle jelszó visszaállítás</h1>
            <p style="font-size: 16px; line-height: 1.5;">
                Erre a linkre kattintva átirányítunk weboldalunkra, ahol megadhatod új jelszavad.
                <strong>A link 30 percig érvényes!</strong>
            </p>
            <a href="${content}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #21262d; color: #58a6ff; text-decoration: none; border: 1px solid #58a6ff; border-radius: 5px; font-weight: bold;">
                Reset Password
            </a>
            <p style="margin-top: 20px; font-size: 14px; color: #8b949e;">
                Ha nem te kérted a jelszó visszaállítást, kérlek hagyd figyelmen kívül ezt az emailt.
            </p>
        </div>`
        });

        if (result.success) {
            res.status(200).json({ message: "Email elküldve!", data: result.data, success: true });
        } else {
            res.status(500).json({ message: "Email elküldése sikertelen!", data: result.error, success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Szerver hiba", success: false });
    }
}

export function getPublicData(req, res) {
    let table = req.params.table;
    const public_tables = process.env.PUBLIC_TABLES.split(',');

    if (!public_tables.includes(table)) {
        sendResults(res, '', { message: 'Nincs jogosultság hozzá!' });
        return;
    }

    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk') {
        value = `%${value}%`;
    }

    pool.query(`SELECT * FROM ${table} WHERE ${field}${op}'${value}'`, (err, results) => {
        sendResults(res, err, results);
    });
}

export function updatePublicData(req, res) {
    let table = req.params.table;
    const public_tables = process.env.PUBLIC_TABLES.split(',');

    if (!public_tables.includes(table)) {
        sendResults(res, '', { message: 'Nincs jogosultság hozzá!' });
        return;
    }

    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk') {
        value = `%${value}%`;
    }
    let fields = Object.keys(req.body);
    let values = Object.values(req.body);
    let updates = fields.map((f, i) => `${f}='${values[i]}'`).join(', ');

    pool.query(`UPDATE ${table} SET ${updates} WHERE ${field}${op}'${value}'`, (err, results) => {
        sendResults(res, err, results);
    });
}



export function getOP(op) {
    switch(op) {
        case 'eq': return '=';
        case 'lt': return '<';
        case 'gt': return '>';
        case 'lte': return '<=';
        case 'gte': return '>=';
        case 'not': return '!=';
        case 'lk': return ' LIKE ';
        default: return '=';
    }
}

export function sendResults(res, err, results) {
    if (err) {
        res.status(500).send(err);
        return;
    }
    res.status(200).send(results);
}

// Helper function to get current datetime in Budapest timezone (UTC+2)
export function getBudapestDateTime() {
  const now = new Date();
  
  // Create a string representing the Budapest timezone offset
  const budapestOffset = '+02:00';
  
  // Format the date in MySQL format with Budapest time
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Helper function to get Budapest time with an offset (for expiration)
export function getBudapestDateTimeWithOffset(minutesOffset) {
  const now = new Date();
  const futureTime = new Date(now.getTime() + minutesOffset * 60 * 1000);
  
  // Format the date in MySQL format with Budapest time
  const year = futureTime.getFullYear();
  const month = String(futureTime.getMonth() + 1).padStart(2, '0');
  const day = String(futureTime.getDate()).padStart(2, '0');
  const hours = String(futureTime.getHours()).padStart(2, '0');
  const minutes = String(futureTime.getMinutes()).padStart(2, '0');
  const seconds = String(futureTime.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Replace the existing functions with these
export function getCurrentMySQLDateTime() {
  return getBudapestDateTime();
}

export function getMySQLDateTimeWithOffset(minutes) {
  return getBudapestDateTimeWithOffset(minutes);
}
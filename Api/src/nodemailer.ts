const nodemailer = require('nodemailer');
import { pool } from "./config/database";

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
            text: "Erre a linkre kattintva átirányítunk weboldalunkra, ahol megadhatod új jelszavad! : link",
            html: `<b>Erre a linkre kattintva átirányítunk weboldalunkra, ahol megadhatod új jelszavad! : ${content}</b>`
        });

        if (result.success) {
            res.status(200).json({ message: "Email sent!", data: result.data, success: true });
        } else {
            res.status(500).json({ message: "Email not sent!", data: result.error, success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", success: false });
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
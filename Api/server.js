require('dotenv');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const router = require('./routes/main')


app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use("/api", router);



app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

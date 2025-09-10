const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");

require('dotenv').config();

const allowedOrigins = (process.env.CORS_ORIGINS as string).split(' ')

const app = express();
app.use(cors({
    origin: function (
        origin: string,
        callback: (err: Error | null, origin?: boolean) => void
    ){
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())

module.exports = app
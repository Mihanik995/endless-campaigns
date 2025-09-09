import type {Request, Response} from "express";

declare function require(module: string): any;
const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRouter = require('./src/auth/routes')
const {verifyToken} = require('./src/auth/middleware')

dotenv.config();

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

app.use('/auth', authRouter)

app.get('/test', verifyToken, (req: Request, res: Response) => {
    res.status(200).send({message: 'Test passed successfully!'})
})

app.listen(5000, () => {
    console.log("Server started on port 3000");
});
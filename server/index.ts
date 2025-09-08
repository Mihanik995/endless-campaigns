import type {Request, Response} from "express";


declare function require(module: string): any;
const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = (process.env.CORS_ORIGINS as string).split(' ')
console.log(allowedOrigins)

const app = express();
app.use(cors({
    origin: function (
        origin: string,
        callback: (err: Error | null, origin?: boolean) => void
    ){
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({msg: "Hello from server!"})
})

app.listen(5000, () => {
    console.log("Server started on port 3000");
});
import type {Request, Response} from 'express'

const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRouter = require('../auth/routes')
const campaignsRouter = require('../campaigns/routes')
const missionsRouter = require('../missions/routes')

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

const reactBuildPath = path.join(process.cwd(), '../frontend/dist');

app.use(express.static(reactBuildPath));

app.use('/api/auth', authRouter)
app.use('/api/campaigns', campaignsRouter)
app.use('/api/missions', missionsRouter)

app.use((req: Request, res: Response) => {
    console.warn(`404: ${req.url}`);
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});

module.exports = app
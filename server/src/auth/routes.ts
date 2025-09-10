import type {Request, Response} from "express";
import type {Users} from "../../generated/prisma";

declare function require(module: string): any;

const {Router} = require("express");
const crypto = require("crypto");
const {PrismaClient} = require('../../generated/prisma')
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer')
const verificationEmail = require('../../templates/verificationEmail')

require('dotenv').config();

const authRouter = Router();
const client = new PrismaClient();

authRouter.post('/register', (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function (err: Error, hashedPassword: Buffer) {
        if (err) throw new Error(err.message);
        client.users.create({
            data: {
                id: uuid(),
                username,
                password: hashedPassword,
                salt,
                email
            }
        }).then((user: Users) => {
            if (user) {
                const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
                return transporter.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to: user.email,
                    subject: 'Verification',
                    html: verificationEmail(token)
                })
            }
        })
            .then(() => res.sendStatus(201))
            .catch((err: Error) => res.status(500).send({error: err.message}))
    })
})

authRouter.get('/verify/:token', (req: Request, res: Response) => {
    const {token} = req.params;
    const {userId} = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) return res.status(400).send({error: 'Invalid link'});
    client.users.update({where: {id: userId}, data: {isActive: true}})
        .then(() => res.status(200).send({userId}))
        .catch((err: Error) => res.status(500).send({error: err.message}))
})

authRouter.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;
    client.users.findUnique({where: {username}})
        .then((user: Users) => {
            if (!user) return res.status(404).json({error: 'User not found'});
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err: Error, hashedPassword: Buffer) {
                if (err) {
                    throw new Error(err.message);
                }
                if (!crypto.timingSafeEqual(hashedPassword, user.password)) {
                    return res.status(401).json({error: 'Authentication failed'});
                }
                if (!user.isActive) return res.status(403).send({error: 'User not verified'});
                const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '15m'})
                const refreshToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET)
                return res.status(200)
                    .cookie('refreshToken', refreshToken, {httpOnly: true})
                    .json({accessToken});
            });
        }).catch((err: Error) => res.status(500).send({error: err.message}));
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({error: 'Authentication failed'});

    try {
        const {userId} = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if (!userId) return res.status(401).json({error: 'Authentication failed'});

        const accessToken = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15m'});
        const newRefreshToken = jwt.sign({userId}, process.env.JWT_SECRET)
        return res.status(200)
            .cookie('refreshToken', newRefreshToken, {httpOnly: true})
            .json({accessToken});
    } catch (error) {
        return res.status(401).json({error: 'Authentication failed'});
    }
})

authRouter.post('/logout', (req: Request, res: Response) => {
    delete req.cookies.refreshToken
    res.cookie('refreshToken', null)
        .sendStatus(200)
})

module.exports = authRouter;
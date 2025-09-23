import type {Request, Response} from "express";
import type {User} from "../../generated/prisma";

declare function require(module: string): any;

const {Router} = require("express");
const crypto = require("crypto");
const {PrismaClient} = require('../../generated/prisma')
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer')
const verificationEmail = require('../../templates/verificationEmail')
const {verifyToken} = require('./middleware')

require('dotenv').config();

const authRouter = Router();
const dbClient = new PrismaClient();

authRouter.post('/register', (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function (err: Error, hashedPassword: Buffer) {
        if (err) throw new Error(err.message);
        dbClient.user.create({
            data: {
                id: uuid(),
                username,
                password: hashedPassword,
                salt,
                email
            }
        }).then((user: User) => {
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
    dbClient.user.update({where: {id: userId}, data: {isActive: true}})
        .then(() => res.status(200).send({userId}))
        .catch((err: Error) => res.status(500).send({error: err.message}))
})

authRouter.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;
    dbClient.user.findUnique({where: {username}})
        .then((user: User) => {
            if (!user) return res.status(404).json({error: 'User not found'});
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err: Error, hashedPassword: Buffer) {
                if (err) {
                    throw new Error(err.message);
                }
                if (!crypto.timingSafeEqual(hashedPassword, user.password)) {
                    return res.status(401).json({error: 'Authentication failed'});
                }
                if (!user.isActive) return res.status(403).send({error: 'User not verified'});

                const userId = user.id
                const username = user.username
                const accessToken = jwt.sign({userId, username}, process.env.JWT_SECRET, {expiresIn: '5m'})
                const refreshToken = jwt.sign({userId, username}, process.env.JWT_SECRET)
                return res.status(200)
                    .cookie('refreshToken', refreshToken, {httpOnly: true})
                    .json({accessToken, userId, username});
            });
        }).catch((err: Error) => res.status(500).send({error: err.message}));
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({error: 'Authentication failed'});

    try {
        const {userId, username} = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if (!userId) return res.status(401).json({error: 'Authentication failed'});

        const accessToken = jwt.sign({userId, username}, process.env.JWT_SECRET, {expiresIn: '5m'});
        const newRefreshToken = jwt.sign({userId, username}, process.env.JWT_SECRET)
        return res.status(200)
            .cookie('refreshToken', newRefreshToken, {httpOnly: true})
            .json({accessToken, userId, username});
    } catch (error) {
        return res.status(401).json({error: 'Authentication failed'});
    }
})

authRouter.post('/logout', (req: Request, res: Response) => {
    delete req.cookies.refreshToken
    res.cookie('refreshToken', null)
        .sendStatus(200)
})

authRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const user = await dbClient.user.findUnique({where: {id}})
        if (!user) return res.status(404).json({error: 'User not found'});
        const {username, email} = user;
        return res.status(200).json({username, email})
    } catch (error) {
        res.status(500).json({error})
    }
})

authRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    const token = req.header('Authorization');
    const data = req.body;
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        if (userId !== id) return res.status(403).json({error: 'Access denied'});
        if (data.username) {
            const alreadyUsed = await dbClient.user.findUnique({where: {username: data.username}});
            if (!alreadyUsed) return res.status(400).json({error: 'Such username is already occupied'});
        }
        const user = await dbClient.user.update({where: {id}, data})
        if (!user) return res.status(404).json({error: 'User not found'});
        const {username, email} = user;
        return res.status(200).json({username, email})
    } catch (error) {
        res.status(500).json({error})
    }
})

authRouter.put('/:id/change-password', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    const token = req.header('Authorization');
    const {password} = req.body;
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        if (userId !== id) return res.status(403).json({error: 'Access denied'});
        const user = await dbClient.user.findUnique({where: {id}})
        if (!user) return res.status(404).json({error: 'User not found'});
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err: Error, hashedPassword: Buffer) {
            if (err) throw new Error(err.message);
            const updatedUser = dbClient.user.update({where: {id}, data: {password: hashedPassword}});
            return res.status(200).json({updatedUser})
        })
    } catch (error) {
        res.status(500).json({error})
    }
})

authRouter.put('/:id/change-email', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    const token = req.header('Authorization');
    const {email} = req.body;
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        if (userId !== id) return res.status(403).json({error: 'Access denied'});
        const alreadyUsed = await dbClient.user.findUnique({where: {email}});
        if (alreadyUsed) return res.status(400).json({error: 'Such e-mail is already occupied'});
        const user = await dbClient.user.update({where: {id}, data: {email, isActive: false}});
        if (!user) return res.status(404).json({error: 'User not found'});
        const verifyToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verification',
            html: verificationEmail(verifyToken)
        })
        return res.sendStatus(200)
    } catch (error) {
        res.status(500).json({error});
    }
})

module.exports = authRouter;
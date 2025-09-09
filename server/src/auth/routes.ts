import type {Request, Response} from "express";
import type {Users} from "../../generated/prisma";

declare function require(module: string): any;
const {Router} = require("express");
const crypto = require("crypto");
const {PrismaClient} = require('../../generated/prisma')
const {v4: uuid} = require('uuid');

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
        }).then((user: Users) => res.status(201).send({user}))
            .catch((err: Error) => res.status(500).send({error: err.message}))
    })
})

module .exports = authRouter;
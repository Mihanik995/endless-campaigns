import type {Request, Response, NextFunction} from "express";

const {Router} = require('express')
const {PrismaClient} = require('../../../generated/prisma')
const {verifyToken} = require('../../auth/middleware')

const linksRouter = new Router()
const dbClient = new PrismaClient()

linksRouter.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    try {
        const link = await dbClient.nodeLink.create({data})
        res.status(201).send(link)
    } catch (error) {
        next(error)
    }
})

linksRouter.delete('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
        dbClient.nodeLink.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        next(error)
    }
})

module.exports = linksRouter
import type {Request, Response, NextFunction} from 'express'

const {Router} = require('express');
const {PrismaClient} = require("../../generated/prisma")
const {verifyToken} = require('../auth/middleware')

const assetsRouter = new Router()
const dbClient = new PrismaClient();

assetsRouter.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    try {
        const newAsset = await dbClient.campaignAsset.create({data})
        res.status(201).json(newAsset)
    } catch (error) {
        next(error)
    }
})

assetsRouter.put('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    const {id} = req.params
    try {
        const updatedAsset = await dbClient.campaignAsset.update({
            where: {id}, data
        })
        res.status(200).json(updatedAsset)
    } catch (error) {
        next(error)
    }
})

assetsRouter.delete('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    dbClient.campaignAsset.delete({where: {id}})
        .then(() => res.sendStatus(204))
        .catch((error: any) => next(error))
})

module.exports = assetsRouter
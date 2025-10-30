import type {Request, Response, NextFunction} from 'express'
import type {MissionNode} from "../../../generated/prisma";

const {Router} = require('express')
const {PrismaClient} = require('../../../generated/prisma')
const {verifyToken} = require('../../auth/middleware')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const nodesRouter = Router()
const dbClient = new PrismaClient()

nodesRouter.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    try {
        const node = await dbClient.missionNode.create({data})
        res.status(201).send(node)
    } catch (error) {
        next(error)
    }
})

nodesRouter.get('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
        const node = await dbClient.missionNode.findUnique({
            where: {id},
            include: {nextLinks: {include: {to: true}}}
        })
        if (!node) return res.status(404).send('Node not found')
        res.status(200).send(node)
    } catch (error) {
        next(error)
    }
})

nodesRouter.get('/mission/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
        const nodes: MissionNode[] = await dbClient.missionNode.findMany({where: {missionId: id}});
        const links = await dbClient.nodeLink.findMany({
            where: {fromId: {in: nodes.map(node => node.id)}},
        });
        res.status(200).json({nodes, links})
    } catch (error) {
        next(error)
    }
})

nodesRouter.put('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const data = req.body
    try {
        const node = await dbClient.missionNode.findUnique({where: {id}})
        if (!node) return res.status(404).send('Node not found')
        const updatedNode = await dbClient.missionNode.update({where: {id}, data})
        res.status(200).send(updatedNode)
    } catch (error) {
        next(error)
    }
})

nodesRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
        dbClient.missionNode.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        next(error)
    }
})

nodesRouter.post('/passed/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const nodeId = req.params.id
    const {pairingId} = req.body
    const token = req.header('Authorization')
    try {
        const {userId: playerId} = jwt.verify(token, process.env.JWT_SECRET)
        const nodeExists = await dbClient.missionNode.findUnique({where: {id: nodeId}})
        const playerOnPairingExists = await dbClient.playersOnPairings
            .findUnique({where: {pairingId_playerId: {playerId, pairingId}}})
        if (!playerOnPairingExists) next(new Error('No PoP found!'))
        if (!nodeExists) next(new Error('Node not found!'))
        const nodePassed = await dbClient.nodesPassedOnPairing.create({
            data: {playerId, pairingId, nodeId}
        })
        res.status(201).send(nodePassed)
    } catch (error) {
        next(error)
    }
})

nodesRouter.get('/passed/pairing/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const pairingId = req.params.id
    try {
        const nodesPassed = await dbClient.nodesPassedOnPairing.findMany({
            where: {pairingId},
            include: {node: true}
        })
        res.status(200).send(nodesPassed)
    } catch (error) {
        next(error)
    }
})

nodesRouter.post('/cancel-pass/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const nodeId = req.params.id
    const {pairingId} = req.body
    const token = req.header('Authorization')
    try {
        const {userId: playerId} = jwt.verify(token, process.env.JWT_SECRET)
        dbClient.nodesPassedOnPairing.delete({
            where: {
                pairingId_nodeId_playerId: {pairingId, nodeId, playerId}
            }
        }).then(() => res.sendStatus(204))
    } catch (error) {
        next(error)
    }
})

module.exports = nodesRouter
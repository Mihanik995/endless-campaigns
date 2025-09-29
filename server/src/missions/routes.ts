import type {Request, Response} from 'express'

const {Router} = require('express');
const {verifyToken} = require('../auth/middleware')
const jwt = require('jsonwebtoken');
const {v4: uuid} = require('uuid');
const {PrismaClient} = require('../../generated/prisma');

require('dotenv').config()

const pairingsRouter = require('./pairings/routes')
const questionsRouter = require('./questions/routes')
const linksRouter = require('./mission-nodes/links-router')
const nodesRouter = require('./mission-nodes/nodes-routes')

const missionsRouter = new Router();
const dbClient = new PrismaClient();

missionsRouter.use('/pairings', pairingsRouter)
missionsRouter.use('/questions', questionsRouter)
missionsRouter.use('/node-links', linksRouter)
missionsRouter.use('/nodes', nodesRouter)

missionsRouter.post('/', verifyToken, async (req: Request, res: Response) => {
    const data = req.body
    const token = req.header('Authorization')
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        data.id = uuid()
        data.creatorId = userId
        const mission = await dbClient.mission.create({data})
        res.status(201).json(mission)
    } catch (error) {
        res.status(500).json({error})
    }
})

missionsRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const missions = await dbClient.mission.findUnique({
            where: {id},
            include: {startNode: true}
        })
        res.status(200).json(missions)
    } catch (error) {
        res.status(500).json({error})
    }
})

missionsRouter.get('/', verifyToken, async (req: Request, res: Response) => {
    const token = req.header('Authorization')
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        const missions = await dbClient.mission.findMany({where: {creatorId: userId}})
        res.status(200).json(missions)
    } catch (error) {
        res.status(500).json({error})
    }
})

missionsRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const token = req.header('Authorization')
    const data = req.body
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        const mission = await dbClient.mission.findUnique({where: {id}})
        if (!mission) return res.status(404).json({message: 'Mission not found'})
        if (mission.creatorId !== userId) return res.status(401).json({error: 'Access denied'})
        const updatedMission = await dbClient.mission.update({where: {id}, data})
        res.status(200).json(updatedMission)
    } catch (error) {
        res.status(500).json({error})
    }
})

missionsRouter.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const token = req.header('Authorization')
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        const mission = await dbClient.mission.findUnique({where: {id}})
        if (!mission) return res.status(404).json({message: 'Mission not found'})
        if (mission.creatorId !== userId) return res.status(401).json({error: 'Access denied'})
        dbClient.mission.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = missionsRouter;
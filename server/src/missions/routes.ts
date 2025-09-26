import type {Request, Response} from 'express'
import type {
    MultiStepMissionEntryPoint,
    SimpleMission
} from "../../generated/prisma";

const {Router} = require('express');
const {verifyToken} = require('../auth/middleware')
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('../../generated/prisma');

require('dotenv').config()

const simpleMissionsRouter = require('./simple-missions/routes')
const multiStepMissionsRoutes = require('./multi-step-missions/routes')
const pairingsRouter = require('./pairings/routes')
const questionsRouter = require('./questions/routes')

const missionsRouter = new Router();
const dbClient = new PrismaClient();

missionsRouter.use('/simple', simpleMissionsRouter)
missionsRouter.use('/multi-step', multiStepMissionsRoutes)
missionsRouter.use('/pairings', pairingsRouter)
missionsRouter.use('/questions', questionsRouter)

missionsRouter.get('/', verifyToken, async (req: Request, res: Response) => {
    const token = req.header('Authorization');
    try {
        const {userId: creatorId} = jwt.verify(token, process.env.JWT_SECRET);
        const simpleMissions = ((
            await dbClient.simpleMission.findMany({where: {creatorId}})
        ) as SimpleMission[])
            .map(simpleMission => {
                return {...simpleMission, type: 'simple'}
            })
        const multiStepMissions = ((
            await dbClient.multiStepMissionEntryPoint.findMany({where: {creatorId}})
        ) as MultiStepMissionEntryPoint[])
            .map(multiStepMission => {
                return {...multiStepMission, type: 'multi-step'}
            })
        res.status(200).json([...simpleMissions, ...multiStepMissions])
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

missionsRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const simpleMission = await dbClient.simpleMission.findUnique({where: {id}})
        if (!simpleMission) {
            const multiStepMission =  await dbClient.multiStepMissionEntryPoint.findUnique({where: {id}})
            if (!multiStepMission) {
                return res.status(404).json({error: 'No mission found'})
            }
            return res.status(200).json({...multiStepMission, type: 'multi-step'})
        }
        return res.status(200).json({...simpleMission, type: 'simple'})
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = missionsRouter;
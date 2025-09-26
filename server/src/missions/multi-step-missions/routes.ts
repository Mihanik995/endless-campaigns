import type {Request, Response} from 'express';

const {Router} = require('express');
const {PrismaClient} = require('../../../generated/prisma');
const jwt = require('jsonwebtoken');
const {v4: uuid} = require('uuid');
const {verifyToken} = require('../../auth/middleware')

require('dotenv').config();

const multiStepMissionsRoutes = new Router();
const dbClient = new PrismaClient();

multiStepMissionsRoutes.post('/', verifyToken, async (req: Request, res: Response) => {
    const data = {...req.body, type: undefined};
    const token = req.header('Authorization');
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        data.creatorId = userId;
        data.id = uuid();
        const multiStepMission = await dbClient.multiStepMissionEntryPoint.create({data});
        res.status(201).json(multiStepMission);
    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
})

multiStepMissionsRoutes.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    try{
        const missions = await dbClient.multiStepMissionEntryPoint.findUnique({where: {id}});
        res.status(200).json(missions);
    } catch (error) {
        res.status(500).send({error});
    }
})

multiStepMissionsRoutes.get('/', verifyToken, async (req: Request, res: Response) => {
    const token = req.header('Authorization');
    try {
        const {userId: creatorId} = jwt.verify(token, process.env.JWT_SECRET);
        const missions = await dbClient.multiStepMissionEntryPoint.findMany({where: {creatorId}});
        res.status(200).json(missions);
    } catch (error) {
        res.status(500).send({error});
    }
})

multiStepMissionsRoutes.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.header('Authorization');
    const data = {...req.body, type: undefined};
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const mission = await dbClient.multiStepMissionEntryPoint.findUnique({where: {id}});
        if (!mission) return res.status(404).send({error: 'Mission Not Found'});
        if (mission.creatorId !== userId) return res.status(401).send({error: 'Access denied'});
        const updatedMission = await dbClient.multiStepMissionEntryPoint.update({
            where: {id},
            data
        })
        res.status(200).json(updatedMission);
    } catch (error)  {
        console.log(error)
        res.status(500).send({error});
    }
})

multiStepMissionsRoutes.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.header('Authorization');
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const mission = await dbClient.multiStepMissionEntryPoint.findUnique({where: {id}});
        if (!mission) return res.status(404).send({error: 'Mission Not Found'});
        if (mission.creatorId !== userId) return res.status(401).send({error: 'Access denied'});
        dbClient.multiStepMissionEntryPoint.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).send({error});
    }
})

module.exports = multiStepMissionsRoutes;
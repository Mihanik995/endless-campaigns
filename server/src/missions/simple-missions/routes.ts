import type {Request, Response} from 'express';

const {Router} = require("express");
const {PrismaClient} = require("../../../generated/prisma")
const jwt = require("jsonwebtoken")
const {v4: uuid} = require("uuid")
const {verifyToken} = require('../../auth/middleware')

require("dotenv").config()

const simpleMissionsRouter = Router()
const dbClient = new PrismaClient()

simpleMissionsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
    const data = req.body
    const token = req.header("Authorization")
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        data.creatorId = userId
        data.id = uuid()
        const mission = await dbClient.simpleMission.create({data})
        res.status(201).json(mission)
    } catch (error) {
        res.status(500).json({error})
    }
})

simpleMissionsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
    const token = req.header("Authorization")
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        const missions = await dbClient.simpleMission.findMany({where: {creatorId: userId}})
        res.status(200).json(missions)
    } catch (error) {
        res.status(500).json({error})
    }
})

simpleMissionsRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const mission = await dbClient.simpleMission.findUnique({where: {id}})
        if (!mission) return res.status(404).json({error: "Mission Not Found"})
        res.status(200).json(mission)
    } catch (error) {
        res.status(500).json({error})
    }
})

simpleMissionsRouter.put("/:id", verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params
    const token = req.header("Authorization")
    const data = req.body
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        const mission = await dbClient.simpleMission.findUnique({where: {id}})
        if (!mission) return res.status(404).json({error: "Mission not found"})
        if (mission.creatorId !== userId) return res.status(403).json({error: "Access denied"})
        const updatedMission = await dbClient.simpleMission.update({where: {id}, data})
        res.status(200).json(updatedMission)
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

simpleMissionsRouter.delete("/:id", verifyToken, (req: Request, res: Response) => {
    const {id} = req.params
    const token = req.header("Authorization")
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        dbClient.simpleMission.delete({where: {id, creatorId: userId}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = simpleMissionsRouter
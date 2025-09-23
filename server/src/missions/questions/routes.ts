import type {Request, Response} from 'express';

const {Router} = require("express");
const {PrismaClient} = require("../../../generated/prisma");
const jwt = require("jsonwebtoken");
const {v4: uuid} = require("uuid");
const {verifyToken} = require("../../auth/middleware")

require("dotenv").config();

const questionsRouter = new Router();
const dbClient = new PrismaClient();

questionsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
    const {text, missionId} = req.body;
    const token = req.header("Authorization");
    try {
        const {userId: creatorId} = jwt.verify(token, process.env.SECRET);
        const id = uuid()
        const question = await dbClient.question.create({
            data: {id, missionId, creatorId, text}
        })
        res.status(201).json({question})
    } catch (error) {
        res.status(500).json({error})
    }
})

questionsRouter.get("/mission/:missionId", verifyToken, async (req: Request, res: Response) => {
    const {missionId} = req.params;
    try {
        const questions = await dbClient.question.findMany({
            where: {missionId}
        })
        if (!questions.length) return res.status(404).json({error: "No question found"})
        res.status(200).json({questions})
    } catch (error) {
        res.status(500).json({error})
    }
})

questionsRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    const data = req.body;
    try {
        const question = await dbClient.question.findUnique({where: {id}});
        if (!question) return res.status(404).json({error: "Question not found"})
        const updatedQuestion = await dbClient.question.update({where: {id}, data})
        res.status(200).json({updatedQuestion})
    } catch (error) {
        res.status(500).json({error})
    }
})

questionsRouter.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        dbClient.question.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = questionsRouter;